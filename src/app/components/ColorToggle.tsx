interface ColorToggleProps {
    colorMode: "green" | "amber" | "cyan";
    onColorChange: (color: "green" | "amber" | "cyan") => void;
}

export default function ColorToggle({
    colorMode,
    onColorChange,
}: ColorToggleProps) {
    return (
        <div className="fixed top-0 right-0 flex items-center gap-0 z-50 text-xl">
            <span className="px-2 py-1 opacity-50">colour selection:</span>
            <button
                onClick={() => onColorChange("green")}
                className="px-2 py-1"
                style={{
                    backgroundColor:
                        colorMode === "green" ? "#9acd32" : "transparent",
                    color: colorMode === "green" ? "#0d1b0d" : "#9acd32",
                    opacity: colorMode === "green" ? 1 : 0.5,
                }}>
                green
            </button>
            <button
                onClick={() => onColorChange("amber")}
                className="px-2 py-1"
                style={{
                    backgroundColor:
                        colorMode === "amber" ? "#ffb000" : "transparent",
                    color: colorMode === "amber" ? "#1a0f00" : "#ffb000",
                    opacity: colorMode === "amber" ? 1 : 0.5,
                }}>
                amber
            </button>
            <button
                onClick={() => onColorChange("cyan")}
                className="px-2 py-1"
                style={{
                    backgroundColor:
                        colorMode === "cyan" ? "#4a9cc7" : "transparent",
                    color: colorMode === "cyan" ? "#d4e8f0" : "#4a9cc7",
                    opacity: colorMode === "cyan" ? 1 : 0.5,
                }}>
                cyan
            </button>
        </div>
    );
}
