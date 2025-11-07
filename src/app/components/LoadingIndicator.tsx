interface LoadingIndicatorProps {
    dots: string;
    color?: string;
}

export default function LoadingIndicator({
    dots,
    color = "#9acd32",
}: LoadingIndicatorProps) {
    return (
        <div
            className="mb-1 blur-[0.3px] whitespace-pre relative z-30"
            style={{
                textShadow: `0 0 3px ${color}b3`,
            }}>
            {dots}
        </div>
    );
}
