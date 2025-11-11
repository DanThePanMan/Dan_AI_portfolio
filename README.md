# Dan Chen – AI Portfolio Chatbot

An **AI-powered interactive portfolio** that lets visitors chat with an intelligent assistant trained on my **real resume, projects, and experience**.
Built using **Retrieval-Augmented Generation (RAG)** to deliver grounded, accurate responses.

**Live Demo:** [danchen.dev](https://danchen.dev)

---

## How It Works

This project implements a **Retrieval-Augmented Generation (RAG)** pipeline that connects structured professional data with natural conversation:

1. **Embedding Creation**: Resume and project content are embedded using OpenAI’s `text-embedding-3-small` model.
2. **Vector Storage**: These embeddings are stored in **Pinecone**, enabling fast, high-dimensional semantic search.
3. **Query Processing**: When a user asks a question, it’s converted into an embedding and compared against stored vectors.
4. **Context Retrieval**: The top matching entries are retrieved as context for response generation.
5. **AI Response**: OpenAI’s GPT-5-mini model generates conversational, context-grounded answers referencing the retrieved data.

This ensures **highly relevant, fact-based answers** grounded in my actual background.

---

## Tech Stack

-   **Frontend**: Next.js, React
-   **Styling**: Tailwind CSS
-   **AI / ML**: OpenAI API (GPT-5 + Embeddings)
-   **Database / Vector Store**: Pinecone
-   **Deployment**: Vercel
-   **Version Control**: GitHub

## Architecture Overview

```
User Query
   │
   ▼
[Embedding via OpenAI API]
   │
   ▼
[Vector Search in Pinecone]
   │
   ▼
[Top Matches Retrieved as Context]
   │
   ▼
[GPT-5 Response Generation]
   │
   ▼
Response → Chat UI (Next.js)
```

---
