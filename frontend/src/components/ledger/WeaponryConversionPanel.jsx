import { motion } from "framer-motion";

// Values arrive pre-floored from the server (Math.floor in
// ledgerAnalytics.service.js) — never a partial bat/packet on screen.
export const WeaponryConversionPanel = ({ conversions }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow duration-150 hover:shadow-md"
  >
    <h3 className="text-sm font-medium text-slate-600">Projected Weaponry Conversion</h3>
    <div className="mt-3 grid grid-cols-2 gap-4">
      <div>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">
          &asymp; {conversions.cricketBats.toLocaleString()}
        </p>
        <p className="text-sm text-slate-500">Cricket bats</p>
      </div>
      <div>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">
          &asymp; {conversions.jhalmuriPackets.toLocaleString()}
        </p>
        <p className="text-sm text-slate-500">Jhalmuri packets</p>
      </div>
    </div>
  </motion.div>
);
