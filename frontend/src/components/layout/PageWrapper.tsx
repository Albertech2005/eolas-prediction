import Navbar from "./Navbar";
import TokenGate from "@/components/gate/TokenGate";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TokenGate>
      <div className="min-h-screen bg-background">
        {/* Ambient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[100px]" />
        </div>
        <Navbar />
        <main className="pt-16 relative z-10">{children}</main>
      </div>
    </TokenGate>
  );
}
