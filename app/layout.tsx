import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manjil's Blog — React & Next.js Developer",
  description:
    "A modern developer blog exploring React, Next.js, TypeScript, and the journey to becoming a professional frontend engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col relative text-slate-900">
        {children}
      </body>
    </html>
  );
}
