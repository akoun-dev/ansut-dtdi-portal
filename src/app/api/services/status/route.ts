import { NextResponse } from "next/server";

type ServiceStatus = "up" | "down" | "unknown";

interface StatusResult {
  serviceId: string;
  domain: string;
  status: ServiceStatus;
  responseTime?: number;
  checkedAt: string;
}

async function checkService(domain: string): Promise<{ status: ServiceStatus; responseTime?: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const start = Date.now();
    const response = await fetch(`https://${domain}`, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const responseTime = Date.now() - start;

    // With no-cors, we get an opaque response
    if (response.type === "opaque" || response.ok) {
      return { status: "up", responseTime };
    }

    return { status: response.ok ? "up" : "down", responseTime };
  } catch {
    clearTimeout(timeout);
    return { status: "unknown" };
  }
}

export async function GET() {
  const domains = [
    "cockpit.ansut.ci",
    "connectmap.ansut.ci",
    "fsuconnect.ansut.ci",
    "labelisation.ansut.ci",
    "lafricamobile.ansut.ci",
    "memo.ansut.ci",
    "mon-toit.ansut.ci",
    "radar.ansut.ci",
  ];

  const results: StatusResult[] = await Promise.all(
    domains.map(async (domain) => {
      const serviceId = domain.replace(/\./g, "-");
      const result = await checkService(domain);

      return {
        serviceId,
        domain,
        status: result.status,
        responseTime: result.responseTime,
        checkedAt: new Date().toISOString(),
      };
    })
  );

  return NextResponse.json({
    statuses: results,
    checkedAt: new Date().toISOString(),
  });
}
