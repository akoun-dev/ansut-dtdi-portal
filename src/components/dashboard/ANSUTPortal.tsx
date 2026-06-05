"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Map,
  Link,
  Activity,
  Smartphone,
  Wrench,
  Globe,
  LayoutDashboard,
  MapPin,
  Cable,
  Tag,
  StickyNote,
  Building2,
  Landmark,
  CreditCard,
  Search,
  ExternalLink,
  Grid3X3,
  List,
  ChevronDown,
  Monitor,
  Zap,
  Shield,
  Clock,
  ArrowUpRight,
  RefreshCw,
  LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  SERVICES,
  CATEGORIES,
  searchServices,
  getServicesByCategory,
  type Service,
  type ServiceCategory,
  type ServiceCategoryInfo,
} from "@/lib/services";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Map,
  MapPin,
  Link,
  Cable,
  Activity,
  Smartphone,
  Wrench,
  Globe,
  LayoutDashboard,
  Tag,
  StickyNote,
  Building2,
  Landmark,
  CreditCard,
  Radar: Monitor,
};

const categoryOrder: ServiceCategory[] = [
  "systems",
  "cartography",
  "api",
  "monitoring",
  "mobile",
  "internal-tools",
  "external",
];

export default function ANSUTPortal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, "up" | "down" | "unknown">>({});
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  const checkStatuses = useCallback(async () => {
    setIsCheckingStatus(true);
    try {
      const res = await fetch("/api/services/status");
      if (res.ok) {
        const data = await res.json();
        const statusMap: Record<string, "up" | "down" | "unknown"> = {};
        data.statuses.forEach(
          (s: { serviceId: string; status: "up" | "down" | "unknown" }) => {
            statusMap[s.serviceId] = s.status;
          }
        );
        setServiceStatuses(statusMap);
        setLastChecked(new Date().toLocaleTimeString("fr-FR"));
      }
    } catch {
      // Status check failed silently
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);

  useEffect(() => {
    checkStatuses();
    const interval = setInterval(checkStatuses, 60000);
    return () => clearInterval(interval);
  }, [checkStatuses]);

  const filteredServices = useMemo(() => {
    if (searchQuery.trim()) {
      const searched = searchServices(searchQuery);
      if (selectedCategory !== "all") {
        return searched.filter((s) => s.category === selectedCategory);
      }
      return searched;
    }
    if (selectedCategory !== "all") {
      return getServicesByCategory(selectedCategory);
    }
    return SERVICES;
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    const up = Object.values(serviceStatuses).filter((s) => s === "up").length;
    const total = Object.keys(serviceStatuses).length;
    return { up, total, services: SERVICES.length };
  }, [serviceStatuses]);

  return (
    <div className="min-h-screen flex flex-col mesh-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#f18120] to-[#205eb3] flex items-center justify-center shadow-lg shadow-[#f18120]/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight">
                  <span className="gradient-text">ANSUT</span>
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">
                  Portail Central des Services
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border/50 focus:border-[#f18120]/50 focus:ring-[#f18120]/20 h-9 text-sm"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    >
                      {viewMode === "grid" ? (
                        <List className="w-4 h-4" />
                      ) : (
                        <Grid3X3 className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{viewMode === "grid" ? "Vue liste" : "Vue grille"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={checkStatuses}
                      disabled={isCheckingStatus}
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${isCheckingStatus ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Vérifier les statuts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {lastChecked && (
                <span className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {lastChecked}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            label="Services total"
            value={stats.services}
            color="#f18120"
          />
          <StatCard
            icon={<Activity className="w-4 h-4" />}
            label="En ligne"
            value={stats.up}
            color="#22c55e"
          />
          <StatCard
            icon={<Monitor className="w-4 h-4" />}
            label="Catégories"
            value={categoryOrder.length}
            color="#205eb3"
          />
          <StatCard
            icon={<Shield className="w-4 h-4" />}
            label="Statut vérifié"
            value={stats.total}
            color="#a855f7"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#f18120] text-white shadow-lg shadow-[#f18120]/25"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            Tous les services
          </button>

          {categoryOrder.map((catId) => {
            const cat = CATEGORIES.find((c) => c.id === catId)!;
            const count = SERVICES.filter((s) => s.category === catId).length;
            const isActive = selectedCategory === catId;

            return (
              <button
                key={catId}
                onClick={() =>
                  setSelectedCategory(isActive ? "all" : catId)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "text-white shadow-lg"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                style={
                  isActive
                    ? { backgroundColor: cat.color, boxShadow: `0 4px 15px ${cat.color}33` }
                    : undefined
                }
              >
                {getIcon(cat.icon)}
                {cat.label}
                <Badge
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px] ml-1"
                >
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Services Grid/List */}
        <AnimatePresence mode="wait">
          {filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun service trouvé</h3>
              <p className="text-muted-foreground text-sm">
                Essayez un autre terme de recherche ou changez de catégorie
              </p>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  status={serviceStatuses[service.id.replace(/\./g, "-")]}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredServices.map((service, index) => (
                <ServiceListItem
                  key={service.id}
                  service={service}
                  status={serviceStatuses[service.id.replace(/\./g, "-")]}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#f18120] to-[#205eb3] flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} ANSUT — Agence Nationale des Services Universels des Télécommunications
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                ansut.ci
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {currentTime}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Stat Card Component */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* Service Card Component */
function ServiceCard({
  service,
  status,
  index,
}: {
  service: Service;
  status?: "up" | "down" | "unknown";
  index: number;
}) {
  const category = CATEGORIES.find((c) => c.id === service.category);
  const Icon = ICON_MAP[service.icon] || Globe;

  return (
    <motion.a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group block"
    >
      <Card className="service-card-glow bg-card/60 border-border/50 backdrop-blur-sm h-full relative overflow-hidden">
        {/* Category accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, ${category?.color || "#f18120"}, transparent)`,
          }}
        />

        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                backgroundColor: `${category?.color}15`,
                color: category?.color,
              }}
            >
              <Icon className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2">
              <StatusIndicator status={status} />
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm group-hover:text-[#f18120] transition-colors">
                {service.name}
              </h3>
              {service.isExternal && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-[#f18120]/30 text-[#f18120]"
                >
                  EXTERNE
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5"
              style={{
                backgroundColor: `${category?.color}15`,
                color: category?.color,
              }}
            >
              {category?.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-mono">
              {service.domain}
            </span>
          </div>
        </CardContent>

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f18120]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Card>
    </motion.a>
  );
}

/* Service List Item Component */
function ServiceListItem({
  service,
  status,
  index,
}: {
  service: Service;
  status?: "up" | "down" | "unknown";
  index: number;
}) {
  const category = CATEGORIES.find((c) => c.id === service.category);
  const Icon = ICON_MAP[service.icon] || Globe;

  return (
    <motion.a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group block"
    >
      <Card className="service-card-glow bg-card/60 border-border/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
              style={{
                backgroundColor: `${category?.color}15`,
                color: category?.color,
              }}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm group-hover:text-[#f18120] transition-colors">
                  {service.name}
                </h3>
                {service.isExternal && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-[#f18120]/30 text-[#f18120]"
                  >
                    EXTERNE
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {service.description}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge
                variant="secondary"
                className="hidden sm:flex text-[10px] px-2 py-0.5"
                style={{
                  backgroundColor: `${category?.color}15`,
                  color: category?.color,
                }}
              >
                {category?.label}
              </Badge>
              <span className="hidden md:block text-[10px] text-muted-foreground font-mono">
                {service.domain}
              </span>
              <StatusIndicator status={status} />
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.a>
  );
}

/* Status Indicator Component */
function StatusIndicator({
  status,
}: {
  status?: "up" | "down" | "unknown";
}) {
  if (!status || status === "unknown") {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
      </div>
    );
  }

  if (status === "up") {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse shadow-lg shadow-emerald-500/50" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
    </div>
  );
}

/* Icon Helper */
function getIcon(iconName: string): React.ReactNode {
  const Icon = ICON_MAP[iconName] || Globe;
  return <Icon className="w-3.5 h-3.5" />;
}
