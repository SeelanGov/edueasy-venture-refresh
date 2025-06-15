
/**
 * Utility to create a lookup from user_id to user summary (tracking_id, name, etc.)
 */
export interface UserSummary {
  tracking_id: string | null;
  full_name?: string | null;
  email?: string | null;
  id_verified?: boolean | null;
}

export function makeUserMap(users: Array<{ id: string; tracking_id: string | null; full_name?: string | null; email?: string | null; id_verified?: boolean | null }>) {
  const map: Record<string, UserSummary> = {};
  users.forEach(u => {
    map[u.id] = {
      tracking_id: u.tracking_id || null,
      full_name: u.full_name || null,
      email: u.email || null,
      id_verified: u.id_verified || false,
    };
  });
  return map;
}
