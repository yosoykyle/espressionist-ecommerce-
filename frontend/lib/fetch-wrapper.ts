// fetch-wrapper.ts
// Global fetch wrapper for admin API: logs out and redirects on 401 Unauthorized or 403 Forbidden

import { authService } from "./api-service";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401 || response.status === 403) {
    authService.logout();
    if (typeof window !== "undefined") {
      window.location.href = "/admin";
    }
    // Optionally, throw to stop further processing
    throw new Error("Unauthorized or Forbidden: Session expired or access denied. Redirecting to login.");
  }
  return response;
}
