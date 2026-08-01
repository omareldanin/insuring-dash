import { HeartPulse } from "lucide-react";
import { baseURL } from "../../../api/api";
import type { Document } from "../../../services/documents";
import UploadedFiles from "./UploadedFiles";
import { SectionCard, InfoField } from "./ui";

export default function LifeDetails({ life }: { life: Document["lifeInfo"] }) {
  return (
    <SectionCard title="تفاصيل تأمين الحياة" icon={<HeartPulse size={18} />}>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <InfoField label="السعر" value={life.price.toLocaleString()} />
        <InfoField
          label="السعر النهائي"
          value={life.finalPrice.toLocaleString()}
        />
        <InfoField label="النسبة" value={`${life.persitage}%`} />
      </div>

      <UploadedFiles
        title="المستندات"
        files={[{ name: "بطاقة الهوية", url: baseURL + life.idImage }]}
      />
    </SectionCard>
  );
}
