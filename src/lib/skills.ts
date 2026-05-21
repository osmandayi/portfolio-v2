export interface SkillCategory { key: "core" | "libraries" | "tools"; items: string[]; }

export const SKILLS: SkillCategory[] = [
  { key: "core", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Node.js", "REST", "PostgreSQL", "MongoDB"] },
  { key: "libraries", items: ["Tailwind CSS", "SASS", "MUI", "shadcn/ui", "Redux Toolkit", "Zustand", "React Query", "React Router", "React Flow", "ApexCharts", "Formik", "Yup", "next-auth", "i18next", "Axios", "JQuery"] },
  { key: "tools", items: ["Git", "GitHub", "Slack", "Jira"] },
];
