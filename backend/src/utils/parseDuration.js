// Minimal "7d" / "15m" / "30s" / "1h" duration parser — avoids pulling in a
// dependency for something this small.
const UNIT_MS = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

export const parseDurationMs = (value) => {
  const match = /^(\d+)([smhd])$/.exec(value.trim());
  if (!match) throw new Error(`Invalid duration string: ${value}`);
  const [, amount, unit] = match;
  return Number(amount) * UNIT_MS[unit];
};
