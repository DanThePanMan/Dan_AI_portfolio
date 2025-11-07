export default function Green() {
    return (
        <>
            {/* Scanlines */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(to bottom, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 2px, transparent 2px, transparent 4px)",
                    backgroundSize: "100% 4px",
                }}
            />

            {/* Screen edges darkening */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    boxShadow: "inset 0 0 120px 40px rgba(0,0,0,0.5)",
                }}
            />
        </>
    );
}
