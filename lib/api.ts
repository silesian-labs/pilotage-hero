const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_INDEXER_URL) {
    return process.env.NEXT_PUBLIC_INDEXER_URL;
  }
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  return isLocal ? "http://localhost:3001" : "https://pilotage-indexer.onrender.com";
};

const API_URL = getApiUrl();

export interface ApiPilot {
  id: number;
  operator: string;
  active: boolean;
  slashed: boolean;
  registered_at: string;
  risk_profile: string; // conservative, balanced, high
  pilotage_score?: number;
  name?: string;
  description?: string;
}

export async function fetchPilots(): Promise<ApiPilot[]> {
  try {
    const res = await fetch(`${API_URL}/api/pilots?limit=100`, { next: { revalidate: 15 } });
    if (!res.ok) throw new Error("Failed to fetch pilots");
    const data = await res.json();
    return data.pilots || [];
  } catch (err) {
    console.error("fetchPilots failed", err);
    return [];
  }
}

export async function fetchPilot(id: number): Promise<ApiPilot | null> {
  try {
    const res = await fetch(`${API_URL}/api/pilots/${id}`, { next: { revalidate: 15 } });
    if (!res.ok) throw new Error("Failed to fetch pilot");
    return await res.json();
  } catch (err) {
    console.error(`fetchPilot(${id}) failed`, err);
    return null;
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_URL}/api/stats`, { next: { revalidate: 15 } });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return await res.json();
  } catch (err) {
    console.error("fetchStats failed", err);
    return { vaults: 0, activePilots: 0, successfulActions: 0 };
  }
}
