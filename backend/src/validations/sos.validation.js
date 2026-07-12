import { body, param } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

// Mirrors API.md §11/§14 exactly — no free-text/geolocation for location.
export const createSosValidation = [
  body("location")
    .isIn(["Library", "Playground", "Corridor", "Classroom", "Canteen"])
    .withMessage("location must be one of Library, Playground, Corridor, Classroom, Canteen."),
  body("occurredAt").isISO8601().withMessage("occurredAt must be a valid ISO8601 date."),
  body("clientEventId").isString().notEmpty().withMessage("clientEventId is required."),
  runValidation,
];

export const sosIdValidation = [param("id").isMongoId().withMessage("Invalid SOS alert id."), runValidation];
