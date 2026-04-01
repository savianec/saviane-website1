import { format, parse } from "date-fns";

/** 30-minute slots from 7:00 through 19:00 (7am–7pm), stored as `HH:mm`. */
const START_MIN = 7 * 60;
const END_MIN = 19 * 60;
const STEP = 30;

function buildSlots(): readonly string[] {
  const out: string[] = [];
  for (let m = START_MIN; m <= END_MIN; m += STEP) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    out.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return out;
}

export const DISCOVERY_CALL_TIME_VALUES = buildSlots();

const allowed = new Set(DISCOVERY_CALL_TIME_VALUES);

export function isValidDiscoveryCallTime(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  return allowed.has(value.trim());
}

export function formatDiscoveryTimeLabel(hhmm: string): string {
  const d = parse(hhmm.trim(), "HH:mm", new Date());
  return format(d, "h:mm a");
}
