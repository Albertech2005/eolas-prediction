import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/layout/Providers";
import { ThemeProvider } from "@/lib/theme";
import FloatingCA from "@/components/ui/FloatingCA";

export const metadata: Metadata = {
  title: "EOLAS — AI Prediction Intelligence",
  description: "Before the market decides, EOLAS predicts. AI-powered prediction market intelligence on Base.",
  icons: { icon: "/eolas-logo.png" },
  openGraph: {
    title: "EOLAS — AI Prediction Intelligence",
    description: "Before the market decides, EOLAS predicts.",
    type: "website",
  },
};

// Inline script to apply theme before first paint — prevents flash
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('eolas-theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash theme script — runs before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-text antialiased">
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
          <FloatingCA />
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--toast-bg, #0D1F3C)",
              color: "var(--toast-text, #E2E8F0)",
              border: "1px solid var(--toast-border, #1A3A6B)",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
