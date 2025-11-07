interface TerminalLineProps {
    content: string;
    color?: string;
}

export default function TerminalLine({
    content,
    color = "#9acd32",
}: TerminalLineProps) {
    return (
        <div
            className="mb-1 blur-[0.3px] whitespace-pre relative z-30"
            style={{
                textShadow: `0 0 3px ${color}b3`,
            }}>
            {content}
        </div>
    );
}
