import { createClient } from "@supabase/supabase-js";
import packageInfo from "@/package.json";

const REQUIRED_ENV_VARS = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "KEYCLOAK_ID",
  "KEYCLOAK_SECRET",
  "KEYCLOAK_ISSUER",
];

function bytesToMegabytes(bytes) {
  return Math.round((bytes / 1024 / 1024) * 100) / 100;
}

function getRuntimeInfo() {
  const memory = process.memoryUsage();

  return {
    app: packageInfo.name,
    version: packageInfo.version,
    nodeEnv: process.env.NODE_ENV ?? "development",
    nodeVersion: process.version,
    uptimeSeconds: Math.round(process.uptime()),
    memoryMb: {
      rss: bytesToMegabytes(memory.rss),
      heapTotal: bytesToMegabytes(memory.heapTotal),
      heapUsed: bytesToMegabytes(memory.heapUsed),
      external: bytesToMegabytes(memory.external),
    },
  };
}

function checkEnvironment() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  return {
    name: "environment",
    status: missing.length === 0 ? "ok" : "error",
    details:
      missing.length === 0
        ? "All required environment variables are configured."
        : `Missing required environment variables: ${missing.join(", ")}`,
  };
}

async function checkSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      name: "supabase",
      status: "error",
      details: "Supabase URL or service role key is not configured.",
    };
  }

  try {
    const startedAt = Date.now();
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true });

    if (error) {
      return {
        name: "supabase",
        status: "error",
        details: error.message,
      };
    }

    return {
      name: "supabase",
      status: "ok",
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      name: "supabase",
      status: "error",
      details: error instanceof Error ? error.message : "Unknown Supabase error",
    };
  }
}

export async function getMonitoringStatus({ includeDependencies = true } = {}) {
  const checks = [checkEnvironment()];

  if (includeDependencies) {
    checks.push(await checkSupabase());
  }

  const status = checks.every((check) => check.status === "ok") ? "ok" : "error";

  return {
    status,
    timestamp: new Date().toISOString(),
    runtime: getRuntimeInfo(),
    checks,
  };
}

export function monitoringResponse(payload) {
  return Response.json(payload, {
    status: payload.status === "ok" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
