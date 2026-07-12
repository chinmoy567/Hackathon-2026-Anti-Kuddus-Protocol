import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

// Mission 3 curriculum corpus — real, user-provided course material spanning two courses
// (CSE-301 Operating Systems, CSE-201 Data Structures & Algorithms). Source of truth for
// topic text; vectors live in Pinecone, keyed by this document's _id (retrieval.service.js).
// examFrequency/examsAvailable must always be read together — a bare examFrequency count is
// not comparable across courses with different numbers of past exams on file.
const curriculumTopicSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, enum: ["CSE-301", "CSE-201"] },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  topicText: { type: String, required: true },
  sourceRef: { type: String, required: true },
  examFrequency: { type: Number, required: true, min: 0, default: 0 },
  examsAvailable: { type: Number, required: true, min: 1 },
});

curriculumTopicSchema.index({ courseCode: 1, subject: 1, chapter: 1 });

export const CurriculumTopic = domainConn.model("CurriculumTopic", curriculumTopicSchema);
