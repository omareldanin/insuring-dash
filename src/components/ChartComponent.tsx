"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
} from "recharts";

type Props = {
  monthlySales: Record<string, { total: number; shipping: number }>;
};

export function formatMonthlySales(
  monthlySales: Record<string, { total: number; shipping: number }>,
) {
  return Object.entries(monthlySales).map(([month, values]) => {
    const [year, m] = month.split("-");
    return {
      month: `${m}-${year}`,
      "عدد المستخدمين": values.total,
      "عدد الوثائق": values.shipping,
    };
  });
}

export default function MonthlyOrdersChart({ monthlySales }: Props) {
  const data = formatMonthlySales(monthlySales);

  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">احصائيات المستخدمين</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="عدد المستخدمين"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="عدد الوثائق"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
