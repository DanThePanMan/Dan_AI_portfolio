import { NextResponse } from "next/server";
import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type Body = {
    input: string;
};

export async function POST(request: Request) {
    try {
        const body: Body = await request.json();

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: body.input,
        });
        return NextResponse.json({ message: response.output_text });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
