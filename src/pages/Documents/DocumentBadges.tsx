import { CheckCircle2, XCircle, FileText, Clock } from "lucide-react";
import type { InsuranceType } from "../../services/plans";

// نوع التأمين كنص
export function getInsuranceTypeLabel(document: {
  insuranceType: InsuranceType;
  healthInfo?: { groupName?: string } | null;
}) {
  if (document.insuranceType === "HEALTH") {
    return document.healthInfo?.groupName ? "صحي جماعي" : "صحي";
  }
  if (document.insuranceType === "CAR") return "سيارات";
  return "حياه";
}

// شارة حالة التأكيد
export function ConfirmBadge({ confirmed }: { confirmed: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full w-fit ${
        confirmed ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
      }`}>
      {confirmed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {confirmed ? "تم التأكيد" : "لم يتم التأكيد"}
    </span>
  );
}

// شارة رقم الوثيقة
export function DocumentNumberBadge({ number }: { number?: string | null }) {
  if (!number) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-full w-fit">
        <Clock size={14} /> قيد الانتظار
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full w-fit">
      <FileText size={14} /> {number}
    </span>
  );
}

// شارة التواريخ
export function DateBadge({
  date,
  tone,
}: {
  date?: string | Date | null;
  tone: "blue" | "purple";
}) {
  if (!date) {
    return (
      <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
        قيد الانتظار
      </span>
    );
  }
  const tones = {
    blue: "text-blue-700 bg-blue-50",
    purple: "text-purple-700 bg-purple-50",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${tones[tone]}`}>
      {new Date(date).toLocaleDateString("ar-EG")}
    </span>
  );
}
