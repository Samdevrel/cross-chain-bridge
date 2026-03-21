import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cross-Chain Bridge | @samdevrel",
  description: "Bridge assets between Ethereum, Arbitrum, Optimism, Base, Polygon, Avalanche, and BNB Chain.",
  keywords: ["bridge", "cross-chain", "Ethereum", "Arbitrum", "Optimism", "Base", "Polygon", "Layer2"],
  authors: [{ name: "Sam", url: "https://x.com/samdevrel" }],
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
