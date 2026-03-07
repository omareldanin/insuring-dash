import type { Document } from "../../../services/documents";
import UploadedFiles from "./UploadedFiles";

export default function LifeDetails({ life }: { life: Document["lifeInfo"] }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-4 text-gray-700">
      <h2 className="text-lg font-semibold">تفاصيل تأمين الحياة</h2>

      <div className="grid grid-cols-3 gap-4">
        <p>السعر: {life.price}</p>
        <p>السعر النهائي: {life.finalPrice}</p>
        <p>النسبة: {life.persitage}%</p>
      </div>

      <UploadedFiles files={[{ name: "بطاقة الهوية", url: life.idImage }]} />
    </div>
  );
}
