import { CheckCircle2, XCircle } from "lucide-react";

// بطاقة قسم موحّدة مع عنوان اختياري وأيقونة
export function SectionCard({
  title,
  icon,
  children,
  className = "",
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-sm text-gray-700 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          {icon && <span className="text-[#1c46a2]">{icon}</span>}
          <h2 className="text-base font-semibold text-gray-800 m-0">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

// حقل معلومة: تسمية صغيرة + قيمة
export function InfoField({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-medium text-gray-800 m-0">
        {value ?? <span className="text-gray-400 font-normal">غير متوفر</span>}
      </p>
    </div>
  );
}

// شارة حالة (أخضر/أحمر) مع أيقونة
export function StatusPill({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full ${
        active ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
      }`}>
      {active ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
