import { CurriculumTopic } from "../models/domain/curriculumTopic.model.js";
import { domainConn } from "../config/db.js";
import { CURRICULUM_CORPUS } from "../fixtures/curriculumCorpus.js";
import * as retrieval from "../services/retrieval.service.js";

// Mission 3 curriculum corpus (task2 spec §3, task2 plan §3.4) — sourced from real, provided
// course materials: CSE-301 Operating Systems and CSE-201 Data Structures & Algorithms
// syllabi + past exams. Idempotent — safe to re-run; upserts by (courseCode, chapter,
// topicText) uniqueness, then re-embeds and upserts every doc to Pinecone (never recomputed
// on a filter request — task2 plan §2 "Ingestion flow (seed-time, not request-time)").
// Run with: npm run seed:curriculum

const seed = async () => {
  await domainConn.asPromise();

  const savedDocs = [];
  for (const topic of CURRICULUM_CORPUS) {
    const doc = await CurriculumTopic.findOneAndUpdate(
      { courseCode: topic.courseCode, chapter: topic.chapter, topicText: topic.topicText },
      topic,
      { upsert: true, returnDocument: "after" }
    );
    savedDocs.push(doc);
  }

  console.log(`${savedDocs.length} curriculum topics upserted to MongoDB. Embedding and upserting to Pinecone...`);
  await retrieval.ingest(savedDocs);

  console.log("Curriculum corpus seeded (MongoDB + Pinecone).");
  console.table(
    savedDocs.map((d) => ({
      courseCode: d.courseCode,
      chapter: d.chapter,
      topicText: d.topicText.slice(0, 50),
      examFrequency: `${d.examFrequency}/${d.examsAvailable}`,
    }))
  );

  await domainConn.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Curriculum seeding failed:", err);
  process.exit(1);
});
