import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Single-series line chart — one measure per chart (dataviz skill: never
// dual-axis). No legend box: one series, so the title already names it.
const formatBucket = (bucket) => {
  const date = new Date(bucket);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const ChartTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="text-slate-500">{formatBucket(label)}</p>
      <p className="font-medium text-slate-900">
        {payload[0].value.toLocaleString()} {unit}
      </p>
    </div>
  );
};

export const LedgerTimeSeriesChart = ({ title, data, valueKey, color, unit }) => (
  <div>
    <h3 className="text-sm font-medium text-slate-600">{title}</h3>
    <div className="mt-2 h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="#e1e0d9" strokeWidth={1} vertical={false} />
          <XAxis
            dataKey="bucket"
            tickFormatter={formatBucket}
            tick={{ fill: "#898781", fontSize: 12 }}
            axisLine={{ stroke: "#c3c2b7" }}
            tickLine={false}
          />
          <YAxis tick={{ fill: "#898781", fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<ChartTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey={valueKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color, stroke: "#fcfcfb", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: color, stroke: "#fcfcfb", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);
