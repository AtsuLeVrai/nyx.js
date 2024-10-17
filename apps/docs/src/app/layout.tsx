import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { inter } from "@/lib";

export const metadata: Metadata = {
    title: "Nyx.js Documentation",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`bg-neutral-900 text-white ${inter.className}`}>{children}</body>
        </html>
    );
}
