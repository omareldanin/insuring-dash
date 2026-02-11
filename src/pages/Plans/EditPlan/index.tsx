"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { updatePlan, type InsuranceType } from "../../../services/plans";
import { queryClient } from "../../../main";
import type { APIError } from "../../../api/api";
import { usePlan } from "../../../hooks/usePlans";
import Loading from "../../../components/loading";

interface Errors {
  nameAr?: string;
  nameEn?: string;
  hintAr?: string;
  hintEn?: string;
}

export default function EditPlan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const planId = Number(id);

  const { data, isLoading } = usePlan(planId);

  // ===== Bilingual fields =====
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [hintAr, setHintAr] = useState("");
  const [hintEn, setHintEn] = useState("");

  const [recommend, setRecommend] = useState(false);
  const [insuranceType, setInsuranceType] = useState("HEALTH");

  const [description, setDescription] = useState<{
    ar: string[];
    en: string[];
  }>({ ar: [], en: [] });

  const [featureAr, setFeatureAr] = useState("");
  const [featureEn, setFeatureEn] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  // ===== Prefill =====
  useEffect(() => {
    if (!data?.data) return;

    const plan = data.data;

    setNameEn(plan.name ?? "");
    setNameAr(plan.arName ?? "");
    setHintEn(plan.hint ?? "");
    setHintAr(plan.arHint ?? "");
    setRecommend(!!plan.recommend);
    setInsuranceType(
      plan.insuranceType === "HEALTH" && plan.forHealthGroups
        ? "HEALTHGroup"
        : (plan.insuranceType ?? "HEALTH"),
    );

    setDescription({
      en: Array.isArray(plan.description) ? plan.description : [],
      ar: Array.isArray(plan.arDescription) ? plan.arDescription : [],
    });
  }, [data?.data]);

  // ===== Validation =====
  const validate = () => {
    const newErrors: Errors = {};

    if (!nameAr.trim()) newErrors.nameAr = "اسم الباقة مطلوب";
    if (!nameEn.trim()) newErrors.nameEn = "Plan name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: any) => updatePlan(planId, payload),
    onSuccess: () => {
      toast.success("تم تعديل الباقة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
      navigate("/plans");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  // ===== Features =====
  const addFeature = () => {
    if (!featureAr.trim() || !featureEn.trim()) {
      toast.error("أدخل الميزة بالعربي والإنجليزي");
      return;
    }

    setDescription((prev) => ({
      ar: [...prev.ar, featureAr.trim()],
      en: [...prev.en, featureEn.trim()],
    }));

    setFeatureAr("");
    setFeatureEn("");
  };

  const removeFeature = (index: number) => {
    setDescription((prev) => ({
      ar: prev.ar.filter((_, i) => i !== index),
      en: prev.en.filter((_, i) => i !== index),
    }));
  };

  const submitHandler = () => {
    if (!validate()) return;

    mutate({
      name: nameEn,
      arName: nameAr,
      hint: hintEn,
      arHint: hintAr,
      recommend,
      insuranceType: insuranceType === "HEALTHGroup" ? "HEALTH" : insuranceType,
      forHealthGroups: insuranceType === "HEALTHGroup" ? true : false,
      description: description.en,
      arDescription: description.ar,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">تعديل الباقة</h1>

      {/* ===== Name ===== */}
      <div className="mb-4">
        <label className="block mb-1 text-[#121E2C]">اسم الباقة (AR)</label>
        <input
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
        {errors.nameAr && (
          <p className="text-red-500 text-sm">{errors.nameAr}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-[#121E2C]">اسم الباقة (EN)</label>
        <input
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
        {errors.nameEn && (
          <p className="text-red-500 text-sm">{errors.nameEn}</p>
        )}
      </div>

      {/* ===== Hint ===== */}
      <div className="mb-4">
        <label className="block mb-1 text-[#121E2C]">وصف مختصر (AR)</label>
        <input
          value={hintAr}
          onChange={(e) => setHintAr(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
        {errors.hintAr && (
          <p className="text-red-500 text-sm">{errors.hintAr}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-[#121E2C]">وصف مختصر (EN)</label>
        <input
          value={hintEn}
          onChange={(e) => setHintEn(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
        {errors.hintEn && (
          <p className="text-red-500 text-sm">{errors.hintEn}</p>
        )}
      </div>

      {/* ===== Insurance Type ===== */}
      <div className="mb-4">
        <label className="block mb-1 text-[#121E2C]">نوع التأمين</label>
        <select
          value={insuranceType}
          onChange={(e) => setInsuranceType(e.target.value as InsuranceType)}
          className="w-full px-4 py-3 border p-2 rounded-lg text-[#121E2C] rounded-lg">
          <option value="HEALTH">صحي</option>
          <option value="HEALTHGroup">صحي جماعي</option>
          <option value="LIFE">حياه</option>
          <option value="CAR">سيارات</option>
        </select>
      </div>

      {/* ===== Recommend ===== */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-[#121E2C]">موصي بها</label>
        <input
          type="checkbox"
          checked={recommend}
          onChange={(e) => setRecommend(e.target.checked)}
          className="w-6 h-6 "
        />
      </div>

      {/* ===== Features ===== */}
      <div className="mb-6">
        <label className="block mb-2 text-[#121E2C]">المميزات (AR / EN)</label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <input
            placeholder="الميزة بالعربي"
            value={featureAr}
            onChange={(e) => setFeatureAr(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="الميزه بالانجليزي"
            value={featureEn}
            onChange={(e) => setFeatureEn(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>

        <button
          type="button"
          onClick={addFeature}
          className="mb-3 bg-blue-600 text-white px-4 py-2 rounded-lg">
          إضافة ميزه
        </button>

        <ul className="space-y-2">
          {description.ar.map((_, index) => (
            <li
              key={index}
              className="border p-2 rounded-lg flex justify-between">
              <div>
                <p className="text-lg text-gray-500">{description.ar[index]}</p>
                <p className="text-lg text-gray-500">{description.en[index]}</p>
              </div>
              <button
                onClick={() => removeFeature(index)}
                className="text-red-500">
                حذف
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== Actions ===== */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/plans")}
          className="px-4 py-2 border rounded-lg bg-gray-400">
          إلغاء
        </button>

        <button
          disabled={isPending}
          onClick={submitHandler}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white">
          {isPending ? "جاري الحفظ...." : "حفظ"}
        </button>
      </div>
    </div>
  );
}
