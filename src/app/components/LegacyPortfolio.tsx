"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import ColorToggle from "./ColorToggle";
import Green from "./Green";
import LoadingIndicator from "./LoadingIndicator";
import TerminalInput from "./TerminalInput";
import TerminalLine from "./TerminalLine";
import TypingLine from "./TypingLine";

const MAX_LINES = 1000;

async function fetchResponse(prompt: string) {
    const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: prompt }),
    });

    if (!response.ok) throw new Error("Failed to generate a response.");
    const data = await response.json();
    return data.message as string;
}

export default function LegacyPortfolio({ onExit }: { onExit: () => void }) {
    const [lines, setLines] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState("");
    const [typingLine, setTypingLine] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingDots, setLoadingDots] = useState(".");
    const [isFocused, setIsFocused] = useState(true);
    const [colorMode, setColorMode] = useState<"green" | "amber" | "cyan">("green");
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    const colors = {
        green: { text: "#9acd32", background: "#0d1b0d" },
        amber: { text: "#ffb000", background: "#1a0f00" },
        cyan: { text: "#b4d7e4", background: "#28a4e6" },
    };

    const typeMessage = (message: string) => {
        setIsTyping(true);

        const wrappedLines: string[] = [];
        message.split("\n").forEach((paragraph) => {
            if (paragraph.length <= 80) {
                wrappedLines.push(paragraph);
                return;
            }

            let currentLine = "";
            paragraph.split(" ").forEach((word) => {
                if ((currentLine + word).length <= 80) {
                    currentLine += `${currentLine ? " " : ""}${word}`;
                } else {
                    if (currentLine) wrappedLines.push(currentLine);
                    currentLine = word;
                }
            });
            if (currentLine) wrappedLines.push(currentLine);
        });

        const fullMessage = wrappedLines.join("\n");
        const words = fullMessage.split(" ");
        let currentIndex = 0;
        const interval = window.setInterval(() => {
            if (currentIndex < words.length) {
                setTypingLine(words.slice(0, currentIndex + 1).join(" "));
                currentIndex += 1;
            } else {
                window.clearInterval(interval);
                setLines((current) => [...current, fullMessage]);
                setTypingLine("");
                setIsTyping(false);
            }
        }, 70);
    };

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;
        inputRef.current?.focus();
        typeMessage(`
============================  D A N - A I  ============================

Welcome to DanAI v1.0 - Interactive AI Terminal Interface
--------------------------------------------------------

> Ask me about my:
    - Projects
    - Experience
    - Background
    
=====================================================================


`);
    }, []);

    useEffect(() => {
        if (!isTyping && !isLoading) inputRef.current?.focus();
    }, [isTyping, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            setLoadingDots(".");
            return;
        }
        const interval = window.setInterval(() => {
            setLoadingDots((dots) => (dots === "." ? ".." : dots === ".." ? "..." : "."));
        }, 350);
        return () => window.clearInterval(interval);
    }, [isLoading]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lines, typingLine, isLoading]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter" || isTyping || isLoading) return;
        const question = currentInput.trim();
        if (!question) return;

        setLines((current) => [...current, `dan@ai:~$ ${question}`].slice(-MAX_LINES));
        setCurrentInput("");
        setIsLoading(true);

        window.setTimeout(() => {
            if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }, 0);

        fetchResponse(question)
            .then((response) => {
                setIsLoading(false);
                typeMessage(response);
            })
            .catch(() => {
                setIsLoading(false);
                typeMessage("Failed to generate a response. Please try again later.");
            });
    };

    return (
        <main ref={terminalRef} className="legacy-terminal" style={{ color: colors[colorMode].text, backgroundColor: colors[colorMode].background }}>
            <Green />
            <button className="legacy-return" onClick={onExit} type="button">return to new site</button>
            <ColorToggle colorMode={colorMode} onColorChange={setColorMode} />
            {lines.map((line, index) => <TerminalLine key={index} content={line} color={colors[colorMode].text} />)}
            {typingLine && <TypingLine content={typingLine} color={colors[colorMode].text} />}
            {isLoading && <LoadingIndicator dots={loadingDots} color={colors[colorMode].text} />}
            {!isTyping && !isLoading && (
                <TerminalInput
                    value={currentInput}
                    onChange={setCurrentInput}
                    onKeyDown={handleKeyDown}
                    inputRef={inputRef}
                    color={colors[colorMode].text}
                    isFocused={isFocused}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            )}
            <div ref={bottomRef} />
        </main>
    );
}
