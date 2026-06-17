// utils/persistence.js — Auto-save and restore pipeline to/from localStorage

const STORAGE_KEY = 'vs_pipeline_v1';

/**
 * Save nodes + edges to localStorage.
 * Returns true on success, false on failure (e.g. storage quota exceeded).
 */
export const savePipeline = (nodes, edges) => {
  try {
    const payload = {
      version: '1.0',
      savedAt: Date.now(),
      nodes,
      edges,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.error('[VectorShift] Failed to save pipeline:', e);
    return false;
  }
};

/**
 * Load saved pipeline from localStorage.
 * Returns { nodes, edges, savedAt } or null if nothing is saved.
 */
export const loadPipeline = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.nodes || !parsed.edges) return null;
    return parsed;
  } catch (e) {
    console.error('[VectorShift] Failed to load pipeline:', e);
    return null;
  }
};

/**
 * Delete the saved pipeline from localStorage.
 */
export const clearSavedPipeline = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Format a timestamp as a human-readable "saved X ago" string.
 */
export const formatSavedTime = (timestamp) => {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};
