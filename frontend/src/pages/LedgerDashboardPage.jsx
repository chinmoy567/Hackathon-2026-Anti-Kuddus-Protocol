import { useState } from "react";
import { useGetLedgerSummaryQuery } from "../store/apiSlice.js";
import { useLedgerSocket } from "../hooks/useLedgerSocket.js";
import { LedgerLiveCounters } from "../components/ledger/LedgerLiveCounters.jsx";
import { LedgerTimeSeriesChart } from "../components/ledger/LedgerTimeSeriesChart.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";

const GROUP_BY_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
];

export const LedgerDashboardPage = () => {
  const [groupBy, setGroupBy] = useState("day");
  const { data, isLoading, isError } = useGetLedgerSummaryQuery(groupBy);
  useLedgerSocket();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Corruption Ledger</h1>
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {GROUP_BY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGroupBy(option.value)}
              className={`rounded-md px-3 py-1 text-sm transition-colors duration-150 ${
                groupBy === option.value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

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
        <>
          <LedgerLiveCounters cashTotal={data.cashTotal} foodTotal={data.foodTotal} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
          </div>
        </>
      )}
    </div>
  );
};
