import { Check } from "lucide-react";

type OrderStatus = "ACCEPTED" | "RECEIVED" | "DELIVERED";

const STATUS_FLOW: { key: OrderStatus; label: string }[] = [
  { key: "ACCEPTED", label: "قبول الاوردر" },
  { key: "RECEIVED", label: "استلام الاوردر" },
  { key: "DELIVERED", label: "تسليم الاوردر" },
];

export default function OrderStatusBar({
  order,
}: {
  order: {
    id: number;
    total: number;
    shipping: number;
    notes: string;
    from: string;
    to: string;
    status: string;
    createdAt: Date;
    timeline: {
      id: number;
      status: string;
      createdAt: Date;
    }[];
  };
}) {
  if (!order) return null;

  const timelineMap: Record<OrderStatus, Date | null> = {
    ACCEPTED: null,
    RECEIVED: null,
    DELIVERED: null,
  };

  order.timeline.forEach((t) => {
    timelineMap[t.status as OrderStatus] = new Date(t.createdAt);
  });

  // Find last completed step index
  const lastDoneIndex = STATUS_FLOW.reduce(
    (acc, step, i) => (timelineMap[step.key] ? i : acc),
    -1
  );

  const formatDate = (d: Date | null) =>
    d
      ? d.toLocaleString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        })
      : "";

  if (order.status === "CANCELED") {
    return (
      <div className="w-full py-4">
        <div className="relative flex justify-center items-center w-full">
          <div className="text-red-600 font-bold text-lg">تم إلغاء الطلب</div>
        </div>
      </div>
    );
  }
  if (order.status === "POSTPOND") {
    return (
      <div className="w-full py-4">
        <div className="relative flex justify-center items-center w-full">
          <div className="text-yellow-600 font-bold text-lg">طلب معلق</div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full px-4">
      <div className="relative flex justify-between items-center w-full">
        {/* --- BACKGROUND LINE --- */}
        <div className="absolute top-4 left-0 right-0 h-1 -translate-y-1/2 bg-gray-400 rounded-full"></div>

        {/* --- FILLED LINE UNTIL LAST CHECKED --- */}
        {lastDoneIndex >= 0 && (
          <div
            className="absolute top-4 right-0 h-1 -translate-y-1/2 bg-purple-600 rounded-full transition-all"
            style={{
              width: `${(lastDoneIndex / (STATUS_FLOW.length - 1)) * 100}%`,
            }}></div>
        )}

        {/* --- CIRCLES + LABELS --- */}
        {STATUS_FLOW.map((step) => {
          const isDone = timelineMap[step.key] !== null;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <div
                className={`w-7 h-7 rounded-full border-4 flex items-center justify-center ${
                  isDone
                    ? "bg-purple-600 border-purple-600"
                    : "bg-white border-gray-400"
                }`}>
                {isDone && <Check size={22} className="text-white" />}
              </div>
            </div>
          );
        })}
        {/* --- CIRCLES + LABELS --- */}
      </div>
      <div className="relative flex justify-between items-center w-full">
        {STATUS_FLOW.map((step) => {
          const isDone = timelineMap[step.key] !== null;
          const date = timelineMap[step.key];

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <span className="mt-2 text-sm">{step.label}</span>

              <span className="text-xs text-gray-500 mt-1">
                {isDone ? formatDate(date) : "---"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
