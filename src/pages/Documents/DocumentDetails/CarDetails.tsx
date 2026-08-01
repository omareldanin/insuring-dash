import { Car } from "lucide-react";
import { baseURL } from "../../../api/api";
import type { Document } from "../../../services/documents";
import UploadedFiles from "./UploadedFiles";
import { SectionCard, InfoField } from "./ui";

export default function CarDetails({ car }: { car: Document["carInfo"] }) {
  return (
    <SectionCard title="تفاصيل السيارة" icon={<Car size={18} />}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <InfoField
          label="السيارة"
          value={`${car.carYear.model.make.name} ${car.carYear.model.name} ${car.carYear.year}`}
        />
        <InfoField label="سعر السيارة" value={car.price.toLocaleString()} />
        <InfoField
          label="السعر النهائي"
          value={car.finalPrice.toLocaleString()}
        />
        <InfoField label="نسبة التأمين" value={`${car.persitage}%`} />
      </div>

      <UploadedFiles
        title="المستندات"
        files={[
          { name: "بطاقة الهوية", url: baseURL + car.idImage },
          { name: "رخصة السيارة", url: baseURL + car.carLicence },
          { name: "رخصة القيادة", url: baseURL + car.driveLicence },
        ]}
      />
    </SectionCard>
  );
}
