"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  Globe,
  Search,
  ExternalLink,
  Grid3X3,
  List,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Sun,
  Moon,
  ImageIcon,
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
  type Service,
} from "@/lib/services";

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export default function ANSUTPortal() {
  const { setTheme, resolvedTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, "up" | "down" | "unknown">>({});
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
      // silent
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);

  useEffect(() => {
    checkStatuses();
    const interval = setInterval(checkStatuses, 300000); // every 5 min
    return () => clearInterval(interval);
  }, [checkStatuses]);

  const filteredServices = useMemo(() => {
    if (searchQuery.trim()) {
      return searchServices(searchQuery);
    }
    return SERVICES;
  }, [searchQuery]);


  const toggleTheme = () => {
    if (!resolvedTheme) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Image
                src="/ansut-logo.png"
                alt="ANSUT"
                width={36}
                height={36}
                className="rounded-lg object-contain shrink-0 sm:w-10 sm:h-10"
                priority
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight">
                  <span className="gradient-text">ANSUT</span>
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">
                  Portail central des applications de la DTDI
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-2 sm:mx-4">
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

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Theme toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={toggleTheme}
                      disabled={!mounted}
                    >
                      {mounted && resolvedTheme === "dark" ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {mounted && resolvedTheme === "dark"
                        ? "Mode clair"
                        : "Mode sombre"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* View toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() =>
                        setViewMode(viewMode === "grid" ? "list" : "grid")
                      }
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

              {/* Refresh status */}
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
                <span className="hidden md:flex items-center gap-1 text-xs text-muted-foreground ml-1">
                  <Clock className="w-3 h-3" />
                  {lastChecked}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
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
                Essayez un autre terme de recherche
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

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/ansut-logo.png"
                alt="ANSUT"
                width={20}
                height={20}
                className="rounded object-contain"
              />
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

/* ── Service Icon (from favicon) ── */
function ServiceIcon({
  domain,
  category,
  size = "md",
}: {
  domain: string;
  category?: { color: string };
  size?: "sm" | "md";
}) {
  const [error, setError] = useState(false);

  const dim = size === "sm" ? "w-10 h-10" : "w-12 h-12";
  const iconDim = size === "sm" ? "w-5 h-5" : "w-6 h-6";

  return (
    <div
      className={`${dim} rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
      style={{
        backgroundColor: error ? `${category?.color || "#f18120"}15` : undefined,
      }}
    >
      <img
        src={getFaviconUrl(domain)}
        alt=""
        className={`${iconDim} object-contain rounded`}
        onError={() => setError(true)}
        style={{ display: error ? "none" : undefined }}
      />
      {error && (
        <ImageIcon
          className={iconDim}
          style={{ color: category?.color || "#f18120" }}
        />
      )}
    </div>
  );
}

/* ── Service Card (Grid) ── */
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
            <ServiceIcon domain={service.domain} category={category} />

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
      </Card>
    </motion.a>
  );
}

/* ── Service List Item ── */
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
            <ServiceIcon domain={service.domain} category={category} size="sm" />

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

/* ── Status Indicator ── */
function StatusIndicator({
  status,
}: {
  status?: "up" | "down" | "unknown";
}) {
  if (!status || status === "unknown") {
    return (
      <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
    );
  }

  if (status === "up") {
    return (
      <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse shadow-lg shadow-emerald-500/50" />
    );
  }

  return (
    <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
  );
}
