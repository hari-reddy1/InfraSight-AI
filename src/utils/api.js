/**
 * InfraSight AI - Official Backend API Client
 * SIH 2026 Problem Statement SIH26103
 * Connects directly to FastAPI backend on http://127.0.0.1:8000/api
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[InfraSight API] Failed request to ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // 1. Health & Provenance Status
  getHealth: () => fetchJson("/health"),
  getDataStatus: () => fetchJson("/data-status"),

  // 2. Executive Dashboard
  getDashboard: () => fetchJson("/dashboard"),

  // 3. Projects Register & Detail
  getProjects: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "all" && v !== "ALL") {
        query.append(k, v);
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : "";
    return fetchJson(`/projects${qs}`);
  },

  getProjectDetail: (projectId) => fetchJson(`/projects/${projectId}`),

  // 4. What-If Scenario Simulation
  simulateProject: (projectId, params = {}) => {
    const query = new URLSearchParams();
    if (params.additional_delay_months != null) query.append("additional_delay_months", params.additional_delay_months);
    if (params.progress_delta_pct != null) query.append("progress_delta_pct", params.progress_delta_pct);
    if (params.cost_escalation_pct != null) query.append("cost_escalation_pct", params.cost_escalation_pct);
    return fetchJson(`/projects/${projectId}/simulate?${query.toString()}`, {
      method: "POST"
    });
  },

  // 5. Risk Prioritization
  getRankings: (params = {}) => {
    const query = new URLSearchParams();
    if (params.limit) query.append("limit", params.limit);
    if (params.tier && params.tier !== "ALL") query.append("tier", params.tier);
    if (params.sector && params.sector !== "ALL") query.append("sector", params.sector);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return fetchJson(`/risk/ranking${qs}`);
  },

  // 6. Early Warning Alerts
  getAlerts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.severity && params.severity !== "ALL") query.append("severity", params.severity);
    if (params.alert_type && params.alert_type !== "ALL") query.append("alert_type", params.alert_type);
    if (params.limit) query.append("limit", params.limit);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return fetchJson(`/alerts${qs}`);
  },

  // 7. Geospatial Projects
  getMapProjects: () => fetchJson("/map/projects"),

  // 8. Data Quality & Conformance
  getDataQuality: () => fetchJson("/data-quality"),

  // 9. Machine Learning Model Benchmarks
  getModels: () => fetchJson("/models"),

  // 10. Manual Sync Trigger
  triggerSync: () => fetchJson("/sync/trigger", { method: "POST" })
};
