from openai import OpenAI
from pinecone import Pinecone
import pandas as pd
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# constants
embedding_model = "text-embedding-3-small"
embedding_encoding = "cl100k_base"
max_tokens = 8000  

# getting the json ready
with open('experience.json', encoding='utf-8') as file:
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

# store them in the vector db
dense_index = pc.Index("dan-ai-portfolio")
dense_index.upsert(vectors=embeddings)
print("Successfully uploaded embeddings to Pinecone!")