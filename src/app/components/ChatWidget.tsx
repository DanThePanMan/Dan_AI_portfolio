"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Message = {
    role: "assistant" | "user";
    content: string;
};

async function askPortfolio(input: string) {
    const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
    });

    if (!response.ok) throw new Error("The assistant is unavailable.");

    const data = await response.json();
    return data.message as string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi, I'm Daniel's portfolio assistant. Ask about his projects, experience, or interests.",
        },
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isLoading]);

    const sendMessage = async (text: string) => {
        const question = text.trim();
        if (!question || isLoading) return;

        setMessages((current) => [...current, { role: "user", content: question }]);
        setDraft("");
        setIsLoading(true);

        try {
            const answer = await askPortfolio(question);
            setMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    content: answer || "I couldn't find an answer to that.",
                },
            ]);
        } catch {
            setMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    content: "I'm having trouble connecting right now. Please try again soon.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void sendMessage(draft);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") setIsOpen(false);
    };

    return (
        <div className="chat-widget">
            {isOpen && (
                <section className="chat-panel" id="portfolio-chat" aria-label="Ask Daniel">
                    <header className="chat-header">
                        <div>
                            <span className="online-dot" aria-hidden="true" />
                            <strong>Ask Daniel</strong>
                            <small>Portfolio assistant</small>
                        </div>
                        <button onClick={() => setIsOpen(false)} type="button" aria-label="Close chat">
                            Close
                        </button>
                    </header>

                    <div className="chat-history" aria-live="polite">
                        {messages.map((message, index) => (
                            <p className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                                {message.content}
                            </p>
                        ))}
                        {isLoading && <p className="chat-message assistant">Thinking...</p>}
                        <div ref={endRef} />
                    </div>

                    {messages.length === 1 && !isLoading && (
                        <div className="chat-suggestions">
                            <button onClick={() => void sendMessage("What projects has Daniel built?")} type="button">
                                Projects
                            </button>
                            <button onClick={() => void sendMessage("What are Daniel's skills?")} type="button">
                                Skills
                            </button>
                        </div>
                    )}

                    <form className="chat-form" onSubmit={onSubmit}>
                        <input
                            ref={inputRef}
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Ask a question"
                            aria-label="Your question"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !draft.trim()}>
                            Send
                        </button>
                    </form>
                </section>
            )}

            <button
                className="chat-trigger"
                onClick={() => setIsOpen((open) => !open)}
                type="button"
                aria-expanded={isOpen}
                aria-controls="portfolio-chat">
                <span aria-hidden="true" />
                {isOpen ? "Close" : "Ask Daniel"}
            </button>
        </div>
    );
}
