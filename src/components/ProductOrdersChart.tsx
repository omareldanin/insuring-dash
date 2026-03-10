"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 👇 Arabic labels and colors for each status
const STATUS_COLORS: Record<string, { label: string; color: string }> = {
  STARTED: { label: "جديد", color: "#3B82F6" }, // blue
  ACCEPTED: { label: "تم التاكيد", color: "#10B981" }, // yellow
};

type OrderStatusData = Record<string, number>;

type OrderStatusChartProps = {
  ordersByStatus: OrderStatusData;
};

export default function OrderStatusChart({
  ordersByStatus,
}: OrderStatusChartProps) {
  // ✅ Convert object → array and remove zeros
  const data = Object.entries(ordersByStatus)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_COLORS[status]?.label || status,
      value: count,
      color: STATUS_COLORS[status]?.color || "#9CA3AF",
    }));

  return (
    <div className="bg-white rounded-xl">
      <h2 className="text-lg font-bold mb-4 text-[#000]">حالة الوثائق</h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            label={({ name, percent }) =>
              `${name} ${((percent as number) * 100).toFixed(0)}%`
            }>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} طلب`} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
