import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Daniel Chen - AI Portfolio",
    description:
        "Interactive AI-powered portfolio showcasing Daniel Chen's projects, experience, and technical skills. Ask me anything about my work!",
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
