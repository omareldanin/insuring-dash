import { baseURL } from "../../../api/api";
import type { Document } from "../../../services/documents";
import UploadedFiles from "./UploadedFiles";

export default function CarDetails({ car }: { car: Document["carInfo"] }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-4 text-gray-700">
      <h2 className="text-lg font-semibold">تفاصيل السيارة</h2>

      <div className="grid grid-cols-4 gap-4">
        <p>
          السيارة: {car.carYear.year} - {car.carYear.model.name}-
          {car.carYear.model.make.name}
        </p>
        <p>سعر السيارة: {car.price}</p>
        <p>السعر النهائي: {car.finalPrice}</p>
        <p>نسبة التأمين: {car.persitage}%</p>
      </div>

      <UploadedFiles
        files={[
          { name: "بطاقة الهوية", url: baseURL + car.idImage },
          { name: "رخصة السيارة", url: baseURL + car.carLicence },
          { name: "رخصة القيادة", url: baseURL + car.driveLicence },
        ]}
      />
    </div>
  );
}
