import { useParams } from "react-router-dom";
import { getDocumentById } from "../../../services/documents";
import CarDetails from "./CarDetails";
import HealthDetails from "./HealthDetails";
import LifeDetails from "./LifeDetails";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/loading";

export default function DocumentDetails() {
  const { id } = useParams();

  const { data: document, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (!document) return <div>Document not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <div className="bg-white p-5 rounded-xl shadow  text-gray-700">
          <div className="mb-3">
            <h1 className="text-xl font-semibold text-gray-700 ">
              تفاصيل الوثيقة #{document.id}
            </h1>
            <p className="text-gray-500 text-sm mt-2">{document.plan.name}</p>
          </div>

          <span
            className={`px-3 py-1  text-sm rounded-full ${
              document.confirmed
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
            {document.confirmed ? "تم التأكيد" : "لم يتم التأكيد"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl shadow  text-gray-700">
          <h2 className="text-lg font-semibold mb-4">معلومات الدفع</h2>

          <div className="flex items-center gap-6">
            {/* Payment Status */}
            <div>
              <p className="text-sm text-gray-500 mb-3">حالة الدفع</p>

              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  document.paid
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                }`}>
                {document.paid ? "💳 تم الدفع" : "❌ لم يتم الدفع"}
              </span>
            </div>

            {/* Payment Key */}
            <div>
              <p className="text-sm text-gray-500 mb-3">رقم العملية</p>

              {document.paidKey ? (
                <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg">
                  {document.paidKey}
                </span>
              ) : (
                <span className="text-gray-400 text-sm">غير متوفر</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-white p-4 rounded-xl shadow grid grid-cols-3 gap-4 text-gray-700">
        <div>
          <p className="text-gray-500 text-sm">رقم الوثيقة</p>
          <p className="font-medium">
            {document.documentNumber || "قيد الانتظار"}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">تاريخ الإصدار</p>
          <p>
            {document.startDate
              ? new Date(document.startDate).toLocaleDateString("ar-EG")
              : "قيد الانتظار"}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">تاريخ الانتهاء</p>
          <p>
            {document.endDate
              ? new Date(document.endDate).toLocaleDateString("ar-EG")
              : "قيد الانتظار"}
          </p>
        </div>
      </div>
      {/* Client + Company */}
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2 text-gray-700">بيانات العميل</h2>
          <p>الاسم: {document.user.name}</p>
          <p>الهاتف: {document.user.phone}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-gray-700">
          <h2 className="font-semibold mb-2">شركة التأمين</h2>
          <p>{document.company.name}</p>
          <p>{document.company.email}</p>
        </div>
      </div>

      {/* TYPE SPECIFIC DETAILS */}
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
