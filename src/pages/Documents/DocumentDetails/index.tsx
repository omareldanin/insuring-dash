import { useParams } from "react-router-dom";
import { getDocumentById } from "../../../services/documents";
import CarDetails from "./CarDetails";
import HealthDetails from "./HealthDetails";
import LifeDetails from "./LifeDetails";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading";
import { FileWarning, User, Building2, CreditCard } from "lucide-react";
import { SectionCard, InfoField, StatusPill } from "./ui";
import { baseURL } from "../../../api/api";

export default function DocumentDetails() {
  const { id } = useParams();

  const { data: document, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (!document)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <FileWarning size={48} strokeWidth={1.5} />
        <p className="mt-3">لم يتم العثور على الوثيقة</p>
      </div>
    );

  const fmtDate = (d?: Date) =>
    d ? new Date(d).toLocaleDateString("ar-EG") : "قيد الانتظار";

  return (
    <div className="space-y-6 pb-10">
      {/* Header: title + status + payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 m-0">
                تفاصيل الوثيقة #{document.id}
              </h1>
              <p className="text-gray-500 text-sm mt-2 m-0">
                {document.plan.arName || document.plan.name}
              </p>
            </div>
            <StatusPill
              active={document.confirmed}
              activeLabel="تم التأكيد"
              inactiveLabel="لم يتم التأكيد"
            />
          </div>
        </SectionCard>

        <SectionCard title="معلومات الدفع" icon={<CreditCard size={18} />}>
          <div className="flex items-center gap-8">
            <div>
              <p className="text-xs text-gray-400 mb-2">حالة الدفع</p>
              <StatusPill
                active={document.paid}
                activeLabel="تم الدفع"
                inactiveLabel="لم يتم الدفع"
              />
            </div>
            <InfoField label="رقم العملية" value={document.paidKey} />
          </div>
        </SectionCard>
      </div>

      {/* Document meta */}
      <SectionCard>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoField label="رقم الوثيقة" value={document.documentNumber} />
          <InfoField
            label="تاريخ الإصدار"
            value={fmtDate(document.startDate)}
          />
          <InfoField label="تاريخ الانتهاء" value={fmtDate(document.endDate)} />
        </div>
      </SectionCard>

      {/* Client + Company */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="بيانات العميل" icon={<User size={18} />}>
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="الاسم" value={document.user.name} />
            <InfoField label="الهاتف" value={document.user.phone} />
          </div>
        </SectionCard>

        <SectionCard title="شركة التأمين" icon={<Building2 size={18} />}>
          <div className="flex items-center gap-4">
            {document.company.logo && (
              <img
                src={baseURL + document.company.logo}
                alt={document.company.name}
                className="w-12 h-12 rounded-lg object-contain border border-gray-100"
              />
            )}
            <div className="grid grid-cols-1 gap-1">
              <InfoField label="الاسم" value={document.company.name} />
              <InfoField label="البريد" value={document.company.email} />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Type-specific details */}
      {document.insuranceType === "CAR" && document.carInfo && (
        <CarDetails car={document.carInfo} />
      )}
      {document.insuranceType === "LIFE" && document.lifeInfo && (
        <LifeDetails life={document.lifeInfo} />
      )}
      {document.insuranceType === "HEALTH" && document.healthInfo && (
        <HealthDetails health={document.healthInfo} />
      )}
    </div>
  );
}
