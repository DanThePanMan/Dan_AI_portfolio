import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Daniel Chen - Software Developer",
    description:
        "Portfolio of Daniel Chen, a software developer based in Ottawa, Canada.",
    icons: {
        icon: [{ url: "/favicon.png?v=6", type: "image/png", sizes: "64x64" }],
        shortcut: "/favicon.png?v=6",
        apple: "/icon.png?v=6",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
