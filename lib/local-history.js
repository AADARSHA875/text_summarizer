const KEY_PREFIX = "summaryHistory";

function historyKey(user) {
  const id = user?.uuid || user?.username || user?.email || "anonymous";
  return `${KEY_PREFIX}:${String(id).toLowerCase()}`;
}

export function getLocalHistory(user) {
  if (typeof window === "undefined" || !user) return [];
  try {
    const raw = localStorage.getItem(historyKey(user));
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveLocalHistory(user, items) {
  if (typeof window === "undefined" || !user) return;
  localStorage.setItem(historyKey(user), JSON.stringify(items));
}

export function appendLocalHistory(user, record) {
  const current = getLocalHistory(user);
  const next = [record, ...current];
  saveLocalHistory(user, next);
  return next;
}

export function deleteLocalHistoryItem(user, id) {
  const next = getLocalHistory(user).filter((item) => item.id !== id);
  saveLocalHistory(user, next);
  return next;
}
