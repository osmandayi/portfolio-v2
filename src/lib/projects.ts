export type ProjectTag = "Frontend" | "FullStack";

export interface Project {
  id: string;
  titleKey: string;
  descKey: string;
  image: string;
  tags: ProjectTag[];
  gitUrl: string | null;
  previewUrl: string | null;
}

export const PROJECTS: Project[] = [
  { id: "coffe-pub", titleKey: "projects.items.coffe.title", descKey: "projects.items.coffe.desc", image: "/projects/coffe-pub.png", tags: ["Frontend"], gitUrl: "https://github.com/osmandayi/CoffePub", previewUrl: "https://coffe-pub.vercel.app/" },
  { id: "sas", titleKey: "projects.items.sas.title", descKey: "projects.items.sas.desc", image: "/projects/sas.png", tags: ["Frontend"], gitUrl: "https://github.com/osmandayi/30Temmuz", previewUrl: "https://30-temmuz.vercel.app/" },
  { id: "ecommerce", titleKey: "projects.items.ecommerce.title", descKey: "projects.items.ecommerce.desc", image: "/projects/online-commerce-and-grocery.png", tags: ["FullStack"], gitUrl: "https://github.com/osmandayi/E-Commerce", previewUrl: "https://online-commerce-and-grocery.vercel.app/" },
  { id: "netflix", titleKey: "projects.items.netflix.title", descKey: "projects.items.netflix.desc", image: "/projects/netflix-clone-fe.png", tags: ["Frontend"], gitUrl: "https://github.com/osmandayi/Netflix-Clone-FE", previewUrl: "https://netflix-clone-fe.vercel.app/" },
  { id: "dijirack", titleKey: "projects.items.dijirack.title", descKey: "projects.items.dijirack.desc", image: "/projects/demo_dijirack.png", tags: ["Frontend"], gitUrl: null, previewUrl: "https://demo.dijirack.com/" },
  { id: "ifi", titleKey: "projects.items.ifi.title", descKey: "projects.items.ifi.desc", image: "/projects/demo_ifi.png", tags: ["Frontend"], gitUrl: null, previewUrl: null },
  { id: "medscript", titleKey: "projects.items.medscript.title", descKey: "projects.items.medscript.desc", image: "/projects/medscript.png", tags: ["Frontend"], gitUrl: null, previewUrl: "https://medscript.dijirack.com/" },
];

export const PROJECT_TAG_FILTERS: ("All" | ProjectTag)[] = ["All", "Frontend", "FullStack"];
