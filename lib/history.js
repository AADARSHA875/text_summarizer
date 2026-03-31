function readString(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function itemOwnerCandidates(item) {
  return [
    item?.user_id,
    item?.user_uuid,
    item?.uuid,
    item?.owner_id,
    item?.owner_uuid,
    item?.created_by,
    item?.created_by_id,
    item?.username,
    item?.user_name,
    item?.owner,
    item?.email,
    item?.user?.id,
    item?.user?.uuid,
    item?.user?.username,
    item?.user?.email,
    item?.owner?.id,
    item?.owner?.uuid,
    item?.owner?.username,
    item?.owner?.email,
  ].map(readString).filter(Boolean);
}

function userCandidates(user) {
  return [
    user?.uuid,
    user?.id,
    user?.username,
    user?.email,
  ].map(readString).filter(Boolean);
}

export function filterHistoryForUser(history, user) {
  if (!Array.isArray(history) || !user) return [];

  const viewer = new Set(userCandidates(user));
  if (viewer.size === 0) return [];

  const hasAnyOwnershipField = history.some((item) => itemOwnerCandidates(item).length > 0);
  if (!hasAnyOwnershipField) return [];

  return history.filter((item) =>
    itemOwnerCandidates(item).some((candidate) => viewer.has(candidate))
  );
}
