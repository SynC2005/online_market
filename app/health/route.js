import { getMonitoringStatus, monitoringResponse } from "@/backend/monitoring/status";

export async function GET() {
  const status = await getMonitoringStatus({ includeDependencies: true });

  return monitoringResponse({
    status: status.status,
    timestamp: status.timestamp,
    checks: status.checks,
  });
}
