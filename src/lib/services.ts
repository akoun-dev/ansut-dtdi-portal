export type ServiceCategory =
  | "systems"
  | "cartography"
  | "api"
  | "monitoring"
  | "mobile"
  | "internal-tools";

export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ServiceCategory;
  icon: string;
  status?: "up" | "down" | "unknown";
  domain: string;
  isExternal?: boolean;
}

export interface ServiceCategoryInfo {
  id: ServiceCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: ServiceCategoryInfo[] = [
  { id: "systems", label: "Systèmes", icon: "Brain", color: "#f18120" },
  { id: "cartography", label: "Cartographie", icon: "Map", color: "#205eb3" },
  { id: "api", label: "API / Interconnexion", icon: "Link", color: "#1c55a3" },
  { id: "monitoring", label: "Monitoring", icon: "Activity", color: "#22c55e" },
  { id: "mobile", label: "Mobile", icon: "Smartphone", color: "#a855f7" },
  { id: "internal-tools", label: "Outils internes", icon: "Wrench", color: "#eab308" },
];

export const SERVICES: Service[] = [
  {
    id: "cockpit",
    name: "Cockpit",
    description: "Système de supervision et de pilotage centralisé",
    url: "https://cockpit.ansut.ci",
    category: "systems",
    icon: "LayoutDashboard",
    domain: "cockpit.ansut.ci",
  },
  {
    id: "connectmap",
    name: "ConnectMap",
    description: "Cartographie et visualisation des réseaux",
    url: "https://connectmap.ansut.ci",
    category: "cartography",
    icon: "MapPin",
    domain: "connectmap.ansut.ci",
  },
  {
    id: "fsuconnect",
    name: "FSU Connect",
    description: "API et interconnexion des services",
    url: "https://fsuconnect.ansut.ci",
    category: "api",
    icon: "Cable",
    domain: "fsuconnect.ansut.ci",
  },
  {
    id: "labelisation",
    name: "Labélisation",
    description: "Traitement et gestion des données de labellisation",
    url: "https://labelisation.ansut.ci",
    category: "systems",
    icon: "Tag",
    domain: "labelisation.ansut.ci",
  },
  {
    id: "lafricamobile",
    name: "L'Afrique Mobile",
    description: "Plateforme mobile et services associés",
    url: "https://lafricamobile.ansut.ci",
    category: "mobile",
    icon: "Smartphone",
    domain: "lafricamobile.ansut.ci",
  },
  {
    id: "memo",
    name: "Memo",
    description: "Notes internes et documentation partagée",
    url: "https://memo.ansut.ci",
    category: "internal-tools",
    icon: "StickyNote",
    domain: "memo.ansut.ci",
  },
  {
    id: "mon-toit",
    name: "Mon Toit",
    description: "Projet immobilier et gestion immobilière",
    url: "https://mon-toit.ansut.ci",
    category: "internal-tools",
    icon: "Building2",
    domain: "mon-toit.ansut.ci",
  },
  {
    id: "radar",
    name: "Radar",
    description: "Monitoring et détection en temps réel",
    url: "https://radar.ansut.ci",
    category: "monitoring",
    icon: "Radar",
    domain: "radar.ansut.ci",
  },

];

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return SERVICES.filter((s) => s.category === category);
}

export function getCategoryById(id: ServiceCategory): ServiceCategoryInfo {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function searchServices(query: string): Service[] {
  const q = query.toLowerCase();
  return SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.domain.toLowerCase().includes(q)
  );
}
