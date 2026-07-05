"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LayoutDashboard, TrendingUp, Eye, Activity, Swords, Trophy, Menu, X, Sun, Moon, Send } from "lucide-react";
import { useTheme } from "@/lib/theme";

// Social icons
const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets", label: "Markets", icon: TrendingUp },
  { href: "/smart-money", label: "Smart Money", icon: Eye },
  { href: "/narratives", label: "Narratives", icon: Activity },
  { href: "/battles", label: "Battles", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-2xl" style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all">
            <Image src="/eolas-logo.png" alt="EOLAS" width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-lg text-white tracking-tight group-hover:text-blue-400 transition-colors">EOLAS</span>
          <span className="badge badge-blue hidden sm:inline-flex">AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-text-dim hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={14} className={active ? "text-blue-400" : ""} />
                {label}
                {label === "Battles" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-fast" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: socials + live + theme toggle + wallet */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Social links */}
          <a
            href="https://x.com/eolas_ai"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow on X"
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border",
              theme === "dark"
                ? "bg-white/5 border-white/10 text-text-dim hover:bg-white/10 hover:text-white hover:border-white/20"
                : "bg-black/5 border-black/10 text-slate-500 hover:bg-black/10 hover:text-slate-900 hover:border-black/20"
            )}
          >
            <XIcon size={13} />
          </a>
          <a
            href="https://t.me/eolastg"
            target="_blank"
            rel="noopener noreferrer"
            title="Join Telegram"
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border",
              theme === "dark"
                ? "bg-white/5 border-white/10 text-text-dim hover:bg-blue-500/15 hover:text-blue-400 hover:border-blue-500/30"
                : "bg-black/5 border-black/10 text-slate-500 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200"
            )}
          >
            <Send size={13} />
          </a>

          <div className="w-px h-5 bg-white/10" />

          <div className="badge badge-live flex items-center gap-2">
            <span className="live-dot" />
            Live
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border",
              theme === "dark"
                ? "bg-white/5 border-white/10 text-text-dim hover:bg-white/10 hover:text-yellow-400 hover:border-yellow-400/30"
                : "bg-black/5 border-black/10 text-slate-500 hover:bg-black/10 hover:text-blue-500 hover:border-blue-500/30"
            )}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark"
              ? <Sun size={15} />
              : <Moon size={15} />
            }
          </button>

          <ConnectButton chainStatus="icon" showBalance={false} accountStatus="avatar" />
        </div>

        {/* Mobile */}
        <button className="lg:hidden p-2 text-text-dim rounded-lg hover:bg-white/5 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/5 bg-surface/95 backdrop-blur-2xl px-4 py-4 space-y-1 animate-slide-up">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  active ? "bg-blue-500/15 text-blue-400" : "text-text-dim hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <ConnectButton chainStatus="icon" showBalance={false} />
            <button
              onClick={toggle}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border",
                theme === "dark"
                  ? "bg-white/5 border-white/10 text-text-dim"
                  : "bg-black/5 border-black/10 text-slate-500"
              )}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
