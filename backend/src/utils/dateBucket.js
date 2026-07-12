// Timestamp coarsening — precise upload/submission times can deanonymize
// ("who was absent at 10:42?"), so anonymous-store writes only ever store a
// bucketed date/hour, never new Date() raw (database.md §10 checklist).

export const coarsenToDate = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const coarsenToHour = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d;
};
