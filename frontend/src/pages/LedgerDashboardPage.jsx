import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import { useGetLedgerSummaryQuery } from "../store/apiSlice.js";
import { useLedgerSocket } from "../hooks/useLedgerSocket.js";
import { LedgerLiveCounters } from "../components/ledger/LedgerLiveCounters.jsx";
import { LedgerTimeSeriesChart } from "../components/ledger/LedgerTimeSeriesChart.jsx";
import { CaloricDisparityPanel } from "../components/ledger/CaloricDisparityPanel.jsx";
import { WeaponryConversionPanel } from "../components/ledger/WeaponryConversionPanel.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { fadeUp, staggerParent } from "../utils/motion.js";

const GROUP_BY_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
];

export const LedgerDashboardPage = () => {
  const [groupBy, setGroupBy] = useState("day");
  const { data, isLoading, isError } = useGetLedgerSummaryQuery(groupBy);
  useLedgerSocket();

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        icon={ScrollText}
        eyebrow="Ledger"
        title="Corruption Ledger"
        description="Live tally of cash and tiffin extortion across the class."
        actions={
          <div className="flex gap-1 rounded-lg border border-white/15 bg-white/5 p-1 backdrop-blur">
            {GROUP_BY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGroupBy(option.value)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors duration-150 ${
                  groupBy === option.value
                    ? "bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <p className="text-sm text-rose-600">Failed to load ledger summary.</p>
        </Card>
      ) : (
        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={staggerParent}>
          <motion.div variants={fadeUp}>
            <LedgerLiveCounters cashTotal={data.cashTotal} foodTotal={data.foodTotal} />
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card>
              <LedgerTimeSeriesChart
                title="Cash extorted over time"
                data={data.series}
                valueKey="cash"
                color="#2a78d6"
                unit="Taka"
              />
            </Card>
            <Card>
              <LedgerTimeSeriesChart
                title="Tiffin items stolen over time"
                data={data.series}
                valueKey="food"
                color="#1baf7a"
                unit="items"
              />
            </Card>
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CaloricDisparityPanel caloricSurplus={data.caloricSurplus} />
            <WeaponryConversionPanel conversions={data.conversions} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
