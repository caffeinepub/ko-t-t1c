export interface HistoryEntry {
  id: string;
  originalImage?: string; // Legacy: single photo
  photoA?: string; // Fusion: first photo
  photoB?: string; // Fusion: second photo
  variations: string[];
  timestamp: number;
}

const HISTORY_KEY = 'ko-tt1c-history';
const MAX_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export async function addToHistory(photoA: string, photoB: string, variations: string[]): Promise<void> {
  try {
    const history = getHistory();
    const newEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      photoA,
      photoB,
      variations,
      timestamp: Date.now(),
    };

    // Add to beginning and limit size
    const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save to history:', error);
    throw error;
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
