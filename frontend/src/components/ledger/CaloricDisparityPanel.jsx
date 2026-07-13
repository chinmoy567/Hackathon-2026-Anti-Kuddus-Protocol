import { motion } from "framer-motion";

// Kuddus's energy expenditure reads as a deliberate zero (indoor Ludu
// lifestyle), not a missing-data bug — the joke is part of the spec.
export const CaloricDisparityPanel = ({ caloricSurplus }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow duration-150 hover:shadow-md"
  >
    <h3 className="text-sm font-medium text-slate-600">Caloric vs. Kinetic Disparity</h3>
    <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
      {caloricSurplus.surplus.toLocaleString()}{" "}
      <span className="text-lg font-normal text-slate-400">cal surplus</span>
    </p>
    <div className="mt-4 flex gap-6 text-sm">
      <div>
        <p className="text-slate-500">Caloric intake</p>
        <p className="font-medium text-slate-900">{caloricSurplus.totalCaloriesIntake.toLocaleString()} cal</p>
      </div>
      <div>
        <p className="text-slate-500">Energy expended</p>
        <p className="font-medium text-slate-900">
          {caloricSurplus.totalCaloriesExpended} cal <span className="text-slate-400">(indoor Ludu lifestyle)</span>
        </p>
      </div>
    </div>
  </motion.div>
);
