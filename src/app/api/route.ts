import { NextResponse } from "next/server";
import OpenAI from "openai";
import { semanticSearch, buildContext } from "./utils";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type Body = {
    input: string;
};

export async function POST(request: Request) {
    try {
        const body: Body = await request.json();

        const searchResults = await semanticSearch(body.input);
        const context = buildContext(searchResults);

        const response = await client.chat.completions.create({
            model: "gpt-5-mini",
            messages: [
                {
                    role: "system",
                    content: `You are Daniel Chen's portfolio robot that presents portfolio details to other people. 
                    Answer questions about Daniel's experience, projects, and skills based ONLY on the provided context.
                    Do not use markdown only respond in plain text. Keep responses short and conversational. 
                    If the question is not about Daniel Chen or cannot be answered from the context, politely decline.
                    If a list is requested, make it in a numbered list with description under each one. 
                    if the context has more info that does not answer the question that much, dont include it
                    Context:${context}`,
                },
                {
                    role: "user",
                    content: body.input,
                },
            ],
        });

        return NextResponse.json({
            message: response.choices[0].message.content,
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 400 }
        );
    }
}
