import { ReactNode } from "react";
import { TopNav } from "./TopNav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Clause Sense Prototype — Clause-level explainability
        </div>
      </footer>
    </div>
  );
}
