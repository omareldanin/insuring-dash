"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { ArrowRight, Save } from "lucide-react";
import { getDocumentById, updateDocument } from "../../services/documents";
import { baseURL, type APIError } from "../../api/api";
import { queryClient } from "../../main";
import Loading from "../../components/loading";
import FileInput from "../../components/FileInput";

type FormValues = {
  startDate: string;
  endDate: string;
  confirmed: boolean;
  paid: boolean;
  paidKey: string;
  documentNumber: string;
  // car / life share these numeric fields
  persitage?: number;
  price?: number;
  finalPrice?: number;
  // health
  groupName?: string;
  totalPrice?: number;
  members: {
    id: number;
    age: number;
    gender: "male" | "female";
    price: number;
    image?: string;
    idImage?: string;
  }[];
};

// yyyy-mm-dd for <input type="date">
const toDateInput = (d?: Date | string) =>
  d ? new Date(d).toISOString().slice(0, 10) : "";

export default function EditDocument() {
  const { id } = useParams();
  const navigation = useNavigate();

  // all File objects live here, keyed by field name
  const [files, setFiles] = useState<Record<string, File>>({});
  const setFile = (key: string, file: File | null) =>
    setFiles((prev) => {
      const next = { ...prev };
      if (file) next[key] = file;
      else delete next[key];
      return next;
    });

  const { data: document, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentById(Number(id)),
    enabled: !!id,
  });

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: { members: [] },
  });

  const { fields: memberFields } = useFieldArray({ control, name: "members" });

  // populate the form once the document arrives
  useEffect(() => {
    if (!document) return;

    const info =
      document.insuranceType === "CAR"
        ? document.carInfo
        : document.insuranceType === "LIFE"
          ? document.lifeInfo
          : undefined;

    reset({
      startDate: toDateInput(document.startDate),
      endDate: toDateInput(document.endDate),
      confirmed: document.confirmed,
      paid: document.paid,
      paidKey: document.paidKey ?? "",
      documentNumber: document.documentNumber ?? "",
      persitage: info?.persitage,
      price: info?.price,
      finalPrice: info?.finalPrice,
      groupName: document.healthInfo?.groupName ?? "",
      totalPrice: document.healthInfo?.totalPrice,
      members:
        document.healthInfo?.members.map((m) => ({
          id: m.id,
          age: m.age,
          gender: m.gender,
          price: m.price,
          image: m.image,
          idImage: m.idImage,
        })) ?? [],
    });
  }, [document, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (fd: FormData) => updateDocument(Number(id), fd),
    onSuccess: () => {
      toast.success("تم تحديث الوثيقة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document", id] });
      navigation("/documents");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!document) return;

    // build the JSON DTO (numbers/strings only — no files)
    const dto: any = {
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      confirmed: values.confirmed,
      paid: values.paid,
      paidKey: values.paidKey || undefined,
      documentNumber: values.documentNumber || undefined,
    };

    if (document.insuranceType === "CAR") {
      dto.carInfo = {
        persitage: Number(values.persitage),
        price: Number(values.price),
        finalPrice: Number(values.finalPrice),
      };
    } else if (document.insuranceType === "LIFE") {
      dto.lifeInfo = {
        persitage: Number(values.persitage),
        price: Number(values.price),
        finalPrice: Number(values.finalPrice),
      };
    } else if (document.insuranceType === "HEALTH") {
      dto.healthInfo = {
        groupName: values.groupName || undefined,
        totalPrice: Number(values.totalPrice),
        members: values.members.map((m) => ({
          id: m.id,
          age: Number(m.age),
          gender: m.gender,
          price: Number(m.price),
        })),
      };
    }

    // assemble multipart
    const fd = new FormData();
    fd.append("data", JSON.stringify(dto));

    // files keyed to match the backend interceptor field names
    Object.entries(files).forEach(([key, file]) => fd.append(key, file));

    mutate(fd);
  };

  if (isLoading) return <Loading />;
  if (!document)
    return <div className="text-gray-500">لم يتم العثور على الوثيقة</div>;

  const url = (p?: string) => (p ? baseURL + p : undefined);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 pb-10"
      dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigation("/documents")}
            className="text-gray-500 hover:text-[#1c46a2]">
            <ArrowRight size={22} />
          </button>
          <h1 className="text-2xl font-bold text-[#121E2C] m-0">
            تعديل الوثيقة #{document.id}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white px-5 py-2 rounded-lg disabled:opacity-60">
          <Save size={16} />
          {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>

      {/* Base fields */}
      <div className="bg-white p-5 rounded-xl shadow-sm text-gray-700">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          البيانات الأساسية
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-400">رقم الوثيقة</label>
            <input
              {...register("documentNumber")}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">تاريخ الإصدار</label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">تاريخ الانتهاء</label>
            <input
              type="date"
              {...register("endDate")}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">رقم العملية</label>
            <input
              {...register("paidKey")}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            />
          </div>
          <label className="flex items-center gap-2 mt-6">
            <input type="checkbox" {...register("paid")} />
            <span className="text-sm">تم الدفع</span>
          </label>
          <label className="flex items-center gap-2 mt-6">
            <input type="checkbox" {...register("confirmed")} />
            <span className="text-sm">تم التأكيد</span>
          </label>
        </div>
      </div>

      {/* CAR */}
      {document.insuranceType === "CAR" && document.carInfo && (
        <div className="bg-white p-5 rounded-xl shadow-sm text-gray-700">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            تفاصيل السيارة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <NumberField label="السعر" reg={register("price")} />
            <NumberField label="السعر النهائي" reg={register("finalPrice")} />
            <NumberField label="النسبة %" reg={register("persitage")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FileInput
              label="بطاقة الهوية"
              current={url(document.carInfo.idImage)}
              onChange={(f) => setFile("idImage", f)}
            />
            <FileInput
              label="رخصة السيارة"
              current={url(document.carInfo.carLicence)}
              onChange={(f) => setFile("carLicence", f)}
            />
            <FileInput
              label="رخصة القيادة"
              current={url(document.carInfo.driveLicence)}
              onChange={(f) => setFile("driveLicence", f)}
            />
          </div>
        </div>
      )}

      {/* LIFE */}
      {document.insuranceType === "LIFE" && document.lifeInfo && (
        <div className="bg-white p-5 rounded-xl shadow-sm text-gray-700">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            تفاصيل تأمين الحياة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <NumberField label="السعر" reg={register("price")} />
            <NumberField label="السعر النهائي" reg={register("finalPrice")} />
            <NumberField label="النسبة %" reg={register("persitage")} />
          </div>
          <FileInput
            label="بطاقة الهوية"
            current={url(document.lifeInfo.idImage)}
            onChange={(f) => setFile("idImage", f)}
          />
        </div>
      )}

      {/* HEALTH */}
      {document.insuranceType === "HEALTH" && document.healthInfo && (
        <div className="bg-white p-5 rounded-xl shadow-sm text-gray-700">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            تفاصيل التأمين الصحي
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs text-gray-400">اسم الشركة</label>
              <input
                {...register("groupName")}
                className="w-full mt-1 p-2 border rounded-lg bg-white"
              />
            </div>
            <NumberField label="السعر الإجمالي" reg={register("totalPrice")} />
          </div>

          {/* company files (group only) */}
          {document.healthInfo.groupName && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <FileInput
                label="السجل التجاري"
                current={url(document.healthInfo.companyCommercialRegister)}
                onChange={(f) => setFile("companyCommercialRegister", f)}
              />
              <FileInput
                label="البطاقة الضريبية"
                current={url(document.healthInfo.companyTaxRegister)}
                onChange={(f) => setFile("companyTaxRegister", f)}
              />
            </div>
          )}

          {/* members */}
          {memberFields.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                الأعضاء ({memberFields.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {memberFields.map((m, i) => (
                  <div
                    key={m.id}
                    className="border border-gray-100 rounded-lg p-4 bg-gray-50/60">
                    <input type="hidden" {...register(`members.${i}.id`)} />
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <NumberField
                        label="العمر"
                        reg={register(`members.${i}.age`)}
                      />
                      <div>
                        <label className="text-xs text-gray-400">الجنس</label>
                        <select
                          {...register(`members.${i}.gender`)}
                          className="w-full mt-1 p-2 border rounded-lg bg-white">
                          <option value="male">ذكر</option>
                          <option value="female">أنثى</option>
                        </select>
                      </div>
                      <NumberField
                        label="السعر"
                        reg={register(`members.${i}.price`)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FileInput
                        label="صورة شخصية"
                        current={url(document.healthInfo?.members[i]?.image)}
                        onChange={(f) => setFile(`memberImage_${i}`, f)}
                      />
                      <FileInput
                        label="بطاقة الهوية"
                        current={url(document.healthInfo?.members[i]?.idImage)}
                        onChange={(f) => setFile(`memberIdImage_${i}`, f)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

// small numeric field helper
function NumberField({ label, reg }: { label: string; reg: ReturnType<any> }) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <input
        type="number"
        step="any"
        {...reg}
        className="w-full mt-1 p-2 border rounded-lg bg-white"
      />
    </div>
  );
}
