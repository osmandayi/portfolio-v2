export interface ExperienceEntry {
  id: string; company: string; roleKey: string; from: string; to: string | null; bulletsKey: string;
  subRoles?: { titleKey: string; bulletsKey: string }[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "huawei", company: "Huawei", roleKey: "experience.huawei.role",
    from: "2025-01", to: null, bulletsKey: "experience.huawei.bullets",
    subRoles: [
      { titleKey: "experience.huawei.nbi.title", bulletsKey: "experience.huawei.nbi.bullets" },
      { titleKey: "experience.huawei.sc.title", bulletsKey: "experience.huawei.sc.bullets" },
    ],
  },
  { id: "azetech", company: "Azetech", roleKey: "experience.azetech.role", from: "2023-01", to: "2025-01", bulletsKey: "experience.azetech.bullets" },
  { id: "hakmar", company: "Hakmar Gıda A.Ş.", roleKey: "experience.hakmar.role", from: "2022-06", to: "2022-07", bulletsKey: "experience.hakmar.bullets" },
];
