import bcrypt from "bcrypt";
import { Student } from "../models/identity/student.model.js";
import { identityConn, anonymousConn, domainConn } from "../config/db.js";

// Seed data workstream (database.md §11) — the class roster + roll→PIN mapping
// is not provided by the problem statement and must be authored by the team.
// Run with: npm run seed  (idempotent — safe to re-run; replaces the roster).
const ROSTER = [
  { name: "Rashid Sir", rollNumber: "TEACHER01", pin: "9001", role: "teacher" },
  { name: "Kodu Kuddus", rollNumber: "CAP1", pin: "9002", role: "captain_1st" },
  { name: "Biltu", rollNumber: "CAP2", pin: "9003", role: "captain_2nd" },
  { name: "Miltu", rollNumber: "CAP3", pin: "9004", role: "captain_3rd" },
  { name: "Ayesha Rahman", rollNumber: "STU01", pin: "1001", role: "student" },
  { name: "Tanvir Hasan", rollNumber: "STU02", pin: "1002", role: "student" },
  { name: "Nusrat Jahan", rollNumber: "STU03", pin: "1003", role: "student" },
  { name: "Farhan Ahmed", rollNumber: "STU04", pin: "1004", role: "student" },
  { name: "Sadia Islam", rollNumber: "STU05", pin: "1005", role: "student" },
  { name: "Rakib Hossain", rollNumber: "STU06", pin: "1006", role: "student" },
];

const seed = async () => {
  await identityConn.asPromise();

  for (const entry of ROSTER) {
    const pinHash = await bcrypt.hash(entry.pin, 10);
    await Student.findOneAndUpdate(
      { rollNumber: entry.rollNumber },
      { name: entry.name, rollNumber: entry.rollNumber, pinHash, role: entry.role, isActive: true },
      { upsert: true, returnDocument: "after" }
    );
  }

  console.log("Roster seeded. Roll number -> PIN (local dev/demo only):");
  console.table(ROSTER.map(({ name, rollNumber, pin, role }) => ({ name, rollNumber, pin, role })));

  await identityConn.close();
  await anonymousConn.close();
  await domainConn.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
