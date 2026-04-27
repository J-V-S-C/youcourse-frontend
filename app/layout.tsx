import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import SessionProvider from "./providers/SessionProvider";
import { ThemeProvider } from "next-themes";
import MuiProvider from "./providers/MuiProvider";
import ThemeProviderClient from "./providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Youcourse",
  description: "A platform made for anyone consume or launch their courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>
          <SessionProvider>
            <ThemeProviderClient>
              <MuiProvider>
                {children}
              </MuiProvider>
            </ThemeProviderClient>
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}