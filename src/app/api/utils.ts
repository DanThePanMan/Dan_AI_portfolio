import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });
const index = pc.index(
    process.env.PINECONE_INDEX_NAME || "",
    process.env.PINECONE_HOST || ""
);

export type SearchMatch = {
    id: string;
    score?: number;
    metadata?: {
        text?: string;
        type?: string;
        category?: string;
        [key: string]: unknown;
    };
};

export type SearchResults = {
    matches: SearchMatch[];
};

export async function semanticSearch(prompt: string): Promise<SearchResults> {
    const embeddingResponse = await client.embeddings.create({
        input: prompt,
        model: "text-embedding-3-small",
    });
    const queryVector = embeddingResponse.data[0].embedding;

    const response = await index.query({
        vector: queryVector,
        topK: 15,
        includeMetadata: true,
    });

    return response as SearchResults;
}

export function buildContext(searchResults: SearchResults): string {
    // Extract text from metadata of each match
    const contextChunks = searchResults.matches
        .map((match: SearchMatch) => {
            return match.metadata?.text || "";
        })
        .filter((text: string) => text.length > 0);

    // Join all chunks with newlines
    return contextChunks.join("\n\n");
}
