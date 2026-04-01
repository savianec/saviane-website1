import { z } from "zod";

/** Matches PostgreSQL uuid text form; looser than RFC4122 (Zod v4's z.uuid() rejects many DB uuids). */
const PG_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPostgresUuid(id: string): boolean {
  return PG_UUID.test(id);
}

export const postgresUuidStringSchema = z
  .string()
  .regex(PG_UUID, "Invalid id");
