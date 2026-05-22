import fs from "node:fs";
import path from "node:path";

const CV_DIR = path.join(process.cwd(), "public");
const CANDIDATES = ["osman_dayi.pdf", "osman_dayi_fe.pdf"] as const;

export interface CvFile {
  file: string;
  href: string;
}

export function getLatestCv(): CvFile {
  const stats = CANDIDATES.map((file) => ({
    file,
    mtime: fs.statSync(path.join(CV_DIR, file)).mtimeMs,
  }));
  stats.sort((a, b) => b.mtime - a.mtime || a.file.localeCompare(b.file));
  return { file: stats[0].file, href: `/${stats[0].file}` };
}
