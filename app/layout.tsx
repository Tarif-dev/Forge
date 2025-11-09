import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SolanaWalletProvider } from "@/components/providers/wallet-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forge - Autonomous Open Source Bounty Management",
  description:
    "An AI agent that autonomously manages the entire open source bounty lifecycle using x402 protocol for payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SolanaWalletProvider>
            <div className="flex min-h-screen flex-col w-full">
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
