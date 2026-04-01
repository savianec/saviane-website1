/** Supabase select fragment for admin project list/detail (embedded client). */
export const ADMIN_PROJECT_EMBED_SELECT =
  "id, client_id, name, status, progress, team_lead, last_update, description, start_date, end_date, next_milestone, next_milestone_due, messages, created_at, clients ( id, name, company )";
