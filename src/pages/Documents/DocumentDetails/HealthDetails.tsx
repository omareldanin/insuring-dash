import { baseURL } from "../../../api/api";
import type { Document } from "../../../services/documents";
import UploadedFiles from "./UploadedFiles";

export default function HealthDetails({
  health,
}: {
  health: Document["healthInfo"];
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-6 text-gray-700">
      <h2 className="text-lg font-semibold">تفاصيل التأمين الصحي</h2>

      <div className="grid grid-cols-3 gap-4">
        <p>
          النوع:{" "}
          {health.type === "INDIVIDUAL"
            ? "فردي"
            : health.type === "FAMILY"
              ? "عائلي"
              : "جماعي"}
        </p>
        {health.groupName && <p>اسم الشركه: {health.groupName}</p>}
        <p>السعر الإجمالي: {health.totalPrice}</p>
      </div>

      {/* Company Files */}
      {health.groupName && (
        <UploadedFiles
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
      )}

      {/* Members */}
      {health.members.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">الأعضاء</h3>

          <div className="grid grid-cols-2 gap-4">
            {health.members.map((m) => (
              <div key={m.id} className="border rounded-lg p-3 bg-gray-50">
                <p>العمر: {m.age}</p>
                <p>الجنس: {m.gender}</p>
                <p>السعر: {m.price}</p>

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
    </div>
  );
}
