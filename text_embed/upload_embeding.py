from openai import OpenAI
from pinecone import Pinecone
import pandas as pd
import json
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = Path(__file__).with_name("experience.json")

# Load the portfolio configuration regardless of the working directory.
load_dotenv(ROOT_DIR / ".env")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# constants
embedding_model = "text-embedding-3-small"
embedding_encoding = "cl100k_base"
max_tokens = 8000  

# getting the json ready
with open(DATA_FILE, encoding='utf-8') as file:
    content = file.read()

# Replace smart quotes and special characters with standard ones
content = content.replace('"', '"').replace('"', '"')
content = content.replace(''', "'").replace(''', "'")
content = content.replace('–', '-').replace('—', '-')

parsed = json.loads(content)

# Store all embeddable text chunks with metadata
embedding_data = []

experiences = parsed.get('experience', [])
for exp in experiences:
    position = exp.get('name', 'Unknown Position')
    from_date = exp.get('from', '')
    to_date = exp.get('to', '')
    location = exp.get('location', '')
    tech_list = exp.get('technology_list', [])
    
    overview = f"Work Experience: {position}"
    if from_date and to_date:
        overview += f" from {from_date} to {to_date}"
    if location:
        overview += f" in {location}"
    if tech_list:
        overview += f". Technologies used: {', '.join(tech_list)}"
    overview += "."
    
    embedding_data.append({
        "text": overview,
        "metadata": {
            "type": "experience",
            "category": "overview",
            "position": position,
            "from_date": from_date,
            "to_date": to_date,
            "location": location,
            "technologies": ", ".join(tech_list) if tech_list else "",
            "text": overview
        }
    })
 
    details = exp.get('details', [])
    for detail_idx, detail in enumerate(details):
        detail_chunk = f"{position}: {detail}"
        embedding_data.append({
            "text": detail_chunk,
            "metadata": {
                "type": "experience",
                "category": "detail",
                "position": position,
                "from_date": from_date,
                "to_date": to_date,
                "location": location,
                "detail_index": detail_idx,
                "detail_text": detail,
                "text": detail_chunk
            }
        })


projects = parsed.get('projects', [])
for proj in projects:
    proj_name = proj.get('name', 'Unknown Project')
    tech_list = proj.get('technology_list', [])
    github_link = proj.get('github_link', '')
    live_demo = proj.get('live_demo', '')
    
    overview = f"Project: {proj_name}"
    if tech_list:
        overview += f". Technologies used: {', '.join(tech_list)}"
    overview += "."
    
    embedding_data.append({
        "text": overview,
        "metadata": {
            "type": "project",
            "category": "overview",
            "project_name": proj_name,
            "technologies": ", ".join(tech_list) if tech_list else "",
            "github_link": github_link,
            "live_demo": live_demo,
            "text": overview
        }
    })
    
    details = proj.get('details', [])
    for detail_idx, detail in enumerate(details):
        detail_chunk = f"{proj_name} project: {detail}"
        embedding_data.append({
            "text": detail_chunk,
            "metadata": {
                "type": "project",
                "category": "detail",
                "project_name": proj_name,
                "detail_index": detail_idx,
                "detail_text": detail,
                "technologies": ", ".join(tech_list) if tech_list else "",
                "text": detail_chunk
            }
        })

contact = parsed.get('contact', {})
if contact:
    contact_text = "Contact Daniel Chen: " + ", ".join(
        f"{label}: {value}" for label, value in contact.items() if value
    )
    embedding_data.append({
        "text": contact_text,
        "metadata": {
            "type": "contact",
            "category": "overview",
            "text": contact_text,
        }
    })

for skill_group in parsed.get('skills', []):
    for detail_idx, detail in enumerate(skill_group.get('details', [])):
        skill_text = f"Daniel Chen's skills: {detail}"
        embedding_data.append({
            "text": skill_text,
            "metadata": {
                "type": "skill",
                "category": "overview",
                "detail_index": detail_idx,
                "text": skill_text,
            }
        })

education_list = parsed.get('education', [])
for edu in education_list:
    edu_str = f"Education: "
    if 'details' in edu:
        edu_str += " ".join(edu['details']) + " "
    if 'University' in edu:
        edu_str += f"at {edu['University']}"
    if 'from' in edu and 'to' in edu:
        edu_str += f" from {edu['from']} to {edu['to']}"
    if 'location' in edu:
        edu_str += f" in {edu['location']}"
    edu_str += "."
    
    embedding_data.append({
        "text": edu_str,
        "metadata": {
            "type": "education",
            "category": "overview",
            "university": edu.get('University', ''),
            "from_date": edu.get('from', ''),
            "to_date": edu.get('to', ''),
            "location": edu.get('location', ''),
            "degree": " ".join(edu.get('details', [])),
            "text": edu_str
        }
    })

print(f"\nTotal embedding chunks: {len(embedding_data)}")

for item in embedding_data:
    print(item['text'])



# call the embeddings api to create embeddings
embeddings = []

for idx, item in enumerate(embedding_data):
    response = client.embeddings.create(
        input = item['text'],
        model="text-embedding-3-small"
    )
    print(f"Processing chunk {idx + 1}/{len(embedding_data)}")
    embeddings.append({
        "id": str(idx),
        "values": response.data[0].embedding,
        "metadata": item['metadata']
    })

# Print all embeddings with ID and metadata (without the vector values)
print("\n" + "="*80)
print("EMBEDDINGS SUMMARY")
print("="*80)
for emb in embeddings:
    print(f"\nID: {emb['id']}")
    print(f"Metadata: {json.dumps(emb['metadata'], indent=2)}")
    print(f"Vector dimensions: {len(emb['values'])}")
    print("-"*80)
    
print(f"\nGenerated {len(embeddings)} embeddings")

# Replace the configured namespace so vectors removed from the source do not remain searchable.
index_name = os.getenv("PINECONE_INDEX_NAME", "dan-ai-portfolio")
index_host = os.getenv("PINECONE_HOST")
namespace = os.getenv("PINECONE_NAMESPACE", "")
dense_index = pc.Index(name=index_name, host=index_host) if index_host else pc.Index(index_name)

delete_options = {"delete_all": True}
upsert_options = {"vectors": embeddings}
if namespace:
    delete_options["namespace"] = namespace
    upsert_options["namespace"] = namespace

dense_index.delete(**delete_options)
dense_index.upsert(**upsert_options)
print("Successfully uploaded embeddings to Pinecone!")
