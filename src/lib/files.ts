import type { LucideIcon } from "lucide-react";
import { FileText, FileCode2, FileJson, Terminal as TerminalIcon, GraduationCap } from "lucide-react";

export type FileId = "readme" | "about" | "experience" | "projects" | "skills" | "education" | "contact";

export interface FileEntry {
  id: FileId; label: string; route: string; icon: LucideIcon; iconColor: string; order: number;
}

export const FILES: FileEntry[] = [
  { id: "readme",     label: "README.md",       route: "/",            icon: FileText,      iconColor: "var(--accent)",   order: 1 },
  { id: "about",      label: "about.md",        route: "/about",       icon: FileText,      iconColor: "var(--accent)",   order: 2 },
  { id: "experience", label: "experience.tsx", route: "/experience",  icon: FileCode2,     iconColor: "var(--warning)",  order: 3 },
  { id: "projects",   label: "projects.tsx",    route: "/projects",    icon: FileCode2,     iconColor: "var(--warning)",  order: 4 },
  { id: "skills",     label: "skills.json",     route: "/skills",      icon: FileJson,      iconColor: "var(--success)",  order: 5 },
  { id: "education",  label: "education.md",   route: "/education",   icon: GraduationCap, iconColor: "var(--accent-2)", order: 6 },
  { id: "contact",    label: "contact.sh",      route: "/contact",     icon: TerminalIcon,  iconColor: "var(--danger)",   order: 7 },
];

export function fileByRoute(route: string): FileEntry | undefined {
  const norm = route.replace(/^\/(en|tr)/, "") || "/";
  return FILES.find((f) => f.route === norm);
}

export function fileById(id: FileId): FileEntry {
  const f = FILES.find((x) => x.id === id);
  if (!f) throw new Error(`unknown file id: ${id}`);
  return f;
}
