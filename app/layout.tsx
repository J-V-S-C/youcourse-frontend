import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import SessionProvider from "./providers/SessionProvider";
import { ThemeProvider } from "next-themes";
import MuiProvider from "./providers/MuiProvider";

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
            <ThemeProvider
              enableSystem={true}
              attribute="data-theme"
              defaultTheme="dark"
              scriptProps={{ 'data-cfasync': 'false' }}
            >
              <MuiProvider>
                {children}
              </MuiProvider>
            </ThemeProvider>
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}