import { Stethoscope, Users } from "lucide-react";
import { baseURL } from "../../../api/api";
import type { Document } from "../../../services/documents";
import UploadedFiles from "./UploadedFiles";
import { SectionCard, InfoField } from "./ui";

const HEALTH_TYPES: Record<string, string> = {
  INDIVIDUAL: "فردي",
  FAMILY: "عائلي",
  GROUP: "جماعي",
};

export default function HealthDetails({
  health,
}: {
  health: Document["healthInfo"];
}) {
  return (
    <SectionCard title="تفاصيل التأمين الصحي" icon={<Stethoscope size={18} />}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <InfoField
          label="النوع"
          value={HEALTH_TYPES[health.type] ?? health.type}
        />
        {health.groupName && (
          <InfoField label="اسم الشركة" value={health.groupName} />
        )}
        <InfoField
          label="السعر الإجمالي"
          value={health.totalPrice.toLocaleString()}
        />
      </div>

      {/* Company files (group only) */}
      {health.groupName && (
        <div className="mb-6">
          <UploadedFiles
            title="مستندات الشركة"
            files={[
              {
                name: "السجل التجاري",
                url: baseURL + health.companyCommercialRegister,
              },
              {
                name: "البطاقة الضريبية",
                url: baseURL + health.companyTaxRegister,
              },
            ]}
          />
        </div>
      )}

      {/* Members */}
      {health.members.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-[#1c46a2]" />
            <h3 className="font-semibold text-gray-800 m-0">
              الأعضاء ({health.members.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {health.members.map((m) => (
              <div
                key={m.id}
                className="border border-gray-100 rounded-lg p-4 bg-gray-50/60">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <InfoField label="العمر" value={`${m.age} سنة`} />
                  <InfoField
                    label="الجنس"
                    value={m.gender === "male" ? "ذكر" : "أنثى"}
                  />
                  <InfoField label="السعر" value={m.price.toLocaleString()} />
                </div>
                <UploadedFiles
                  files={[
                    { name: "صورة شخصية", url: baseURL + m.image },
                    { name: "بطاقة الهوية", url: baseURL + m.idImage },
                  ]}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
