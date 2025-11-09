"use client";
import { useState, useRef, useEffect } from "react";
import Green from "./components/Green";
import TerminalLine from "./components/TerminalLine";
import TypingLine from "./components/TypingLine";
import LoadingIndicator from "./components/LoadingIndicator";
import TerminalInput from "./components/TerminalInput";
import ColorToggle from "./components/ColorToggle";

const MAX_LINES = 1000;

// test function before I implement the actual rag logic
async function fetchResponse(prompt: string) {
    const res = await fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
    });

    if (!res.ok)
        throw new Error("Failed to generate response, please try again later.");
    const data = await res.json();
    return data.message;
}

export default function Home() {
    const [lines, setLines] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState("");
    const [typingLine, setTypingLine] = useState<string>("");
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingDots, setLoadingDots] = useState(".");
    const [isFocused, setIsFocused] = useState(true);
    const [colorMode, setColorMode] = useState<"green" | "amber" | "cyan">(
        "green"
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    const colors = {
        green: {
            text: "#9acd32",
            bg: "#0d1b0d",
        },
        amber: {
            text: "#ffb000",
            bg: "#1a0f00",
        },
        cyan: {
            text: "#b4d7e4",
            bg: "#28a4e6",
        },
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!isTyping && !isLoading) {
            inputRef.current?.focus();
        }
    }, [isTyping, isLoading]);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingDots((prev) => {
                    if (prev === ".") return "..";
                    if (prev === "..") return "...";
                    return ".";
                });
            }, 350);
            return () => clearInterval(interval);
        } else {
            setLoadingDots(".");
        }
    }, [isLoading]);

    useEffect(() => {
        const welcomeMessage = `
============================  D A N - A I  ============================

Welcome to DanAI v1.0 - Interactive AI Terminal Interface
--------------------------------------------------------

> Ask me about my:
    - Projects
    - Experience
    - Background
    
=====================================================================


`;
        typeMessage(welcomeMessage);
    }, []);

    const typeMessage = (message: string) => {
        setIsTyping(true);
        const words = message.split(" ");
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < words.length) {
                const displayText = words.slice(0, currentIndex + 1).join(" ");
                setTypingLine(displayText);
                currentIndex++;
            } else {
                clearInterval(interval);
                setLines((prev) => [...prev, message]);
                setTypingLine("");
                setIsTyping(false);
            }
        }, 70);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isTyping && !isLoading) {
            const userInput = currentInput.trim();

            if (!userInput) {
                return;
            }

            const newLines = [...lines, `dan@ai:~$ ${userInput}`].slice(
                -MAX_LINES
            );
            setLines(newLines);
            setCurrentInput("");
            setIsLoading(true);

            // Scroll to bottom
            setTimeout(() => {
                if (terminalRef.current) {
                    terminalRef.current.scrollTop =
                        terminalRef.current.scrollHeight;
                }
            }, 0);

            // now we call our RAG agent Maybe add some text to show wha tool is being used
            fetchResponse(userInput)
                .then((res) => {
                    setIsLoading(false);
                    typeMessage(res as string);
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                    typeMessage(
                        "Failed to Generate response, please try again later."
                    );
                });
        }
    };

    return (
        <div
            ref={terminalRef}
            className="p-12 text-2xl relative min-h-screen overflow-auto "
            style={{
                color: colors[colorMode].text,
                backgroundColor: colors[colorMode].bg,
            }}>
            <Green />

            <ColorToggle colorMode={colorMode} onColorChange={setColorMode} />

            {lines.map((line, index) => (
                <TerminalLine
                    key={index}
                    content={line}
                    color={colors[colorMode].text}
                />
            ))}
            {typingLine && (
                <TypingLine
                    content={typingLine}
                    color={colors[colorMode].text}
                />
            )}
            {isLoading && (
                <LoadingIndicator
                    dots={loadingDots}
                    color={colors[colorMode].text}
                />
            )}
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
        </div>
    );
}
