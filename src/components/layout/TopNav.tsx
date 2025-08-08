import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Settings, FileText, History, Home, MessageSquare, FolderOpen } from "lucide-react";

const linkBase = "px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/60 transition-smooth";
const activeCls = "bg-secondary text-foreground";

export function TopNav() {
  const navLink = (to: string, label: string, Icon: any) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) => `${linkBase} ${isActive ? activeCls : ''} flex items-center gap-2`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="font-semibold tracking-tight">
            LLM Document Processor
          </NavLink>
          <nav className="hidden md:flex items-center gap-1">
            {navLink('/', 'Dashboard', Home)}
            {navLink('/upload', 'Upload Documents', Upload)}
            {navLink('/query', 'Query', MessageSquare)}
            {navLink('/documents', 'Documents', FileText)}
            {navLink('/audit', 'Audit Log', History)}
            {navLink('/settings', 'Settings', Settings)}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <NavLink to="/upload">Upload</NavLink>
          </Button>
          <Button asChild variant="hero" size="sm">
            <NavLink to="/query">New query</NavLink>
          </Button>
          <Avatar className="ml-2 h-8 w-8">
            <AvatarFallback>CA</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="md:hidden border-t">
        <div className="container py-2 flex gap-1 overflow-x-auto">
          {navLink('/upload', 'Upload', Upload)}
          {navLink('/query', 'Query', MessageSquare)}
          {navLink('/documents', 'Documents', FileText)}
          {navLink('/audit', 'Audit', History)}
          {navLink('/settings', 'Settings', Settings)}
        </div>
      </div>
    </header>
  );
}
