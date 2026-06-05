import { NextResponse } from "next/server";
import { SERVICES, CATEGORIES, type Service, type ServiceCategoryInfo } from "@/lib/services";

export type ServicesResponse = {
  services: Service[];
  categories: ServiceCategoryInfo[];
  total: number;
  timestamp: string;
};

export async function GET() {
  const response: ServicesResponse = {
    services: SERVICES,
    categories: CATEGORIES,
    total: SERVICES.length,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
