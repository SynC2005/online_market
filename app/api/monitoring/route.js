import { getMonitoringStatus, monitoringResponse } from "@/backend/monitoring/status";

export async function GET() {
  return monitoringResponse(await getMonitoringStatus());
}
