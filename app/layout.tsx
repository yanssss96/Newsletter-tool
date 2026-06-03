import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nakama Mail",
  description: "Newsletter tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}