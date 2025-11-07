import { RefObject } from "react";

interface TerminalInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputRef?: RefObject<HTMLInputElement | null>;
    color?: string;
    isFocused?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}

export default function TerminalInput({
    value,
    onChange,
    onKeyDown,
    inputRef,
    color = "#9acd32",
    isFocused = true,
    onFocus,
    onBlur,
}: TerminalInputProps) {
    return (
        <div className="flex flex-row justify-start items-center w-full relative z-30">
            <span className="flex flex-row items-center w-full">
                <span
                    className="blur-[0.3px] whitespace-pre"
                    style={{
                        textShadow: `0 0 3px ${color}b3`,
                    }}>
                    {"dan@ai:~$ "}
                </span>
                <div className="flex-1 relative flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={onKeyDown}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        className="w-full bg-transparent border-none outline-none caret-block"
                        style={{
                            color: color,
                            textShadow: `0 0 3px ${color}b3`,
                        }}
                        autoComplete="off"
                        spellCheck="false"
                    />
                    {isFocused && (
                        <span
                            className="absolute left-0 pointer-events-none animate-blink"
                            style={{
                                width: "0.6em",
                                height: "1em",
                                backgroundColor: color,
                                transform: `translateX(${value.length}ch)`,
                            }}
                        />
                    )}
                </div>
            </span>
        </div>
    );
}
