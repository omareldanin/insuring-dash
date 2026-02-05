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
export default function EditPlan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const planId = Number(id);

  const { data, isLoading } = usePlan(planId);

  const [name, setName] = useState("");
  const [hint, setHint] = useState("");
  const [recommend, setRecommend] = useState(false);
  const [insuranceType, setInsuranceType] = useState<InsuranceType>("HEALTH");
  const [description, setDescription] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // 🔁 fill form when data loaded
  useEffect(() => {
    if (!data?.data) return;

    const plan = data.data;
    console.log(plan);

    setName(plan.name ?? "");
    setHint(plan.hint ?? "");
    setRecommend(!!plan.recommend);
    setInsuranceType(plan.insuranceType ?? "HEALTH");
    setDescription(Array.isArray(plan.description) ? plan.description : []);
  }, [data?.data]);

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

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setDescription((prev) => [...prev, featureInput.trim()]);
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setDescription((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = () => {
    mutate({
      name,
      hint,
      recommend,
      insuranceType,
      description: description.length ? description : undefined,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">تعديل الباقة</h1>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1 text-[#121E2C]">اسم الباقة</label>
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Hint */}
      <div className="mb-4">
        <label className="block mb-1 text-[#121E2C]">وصف مختصر</label>
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
        />
      </div>

      {/* Insurance Type */}
      <div className="mb-4">
        <label className="block mb-1 text-[#121E2C]">نوع التأمين</label>
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          value={insuranceType}
          onChange={(e) => setInsuranceType(e.target.value as InsuranceType)}>
          <option value={"HEALTH"}>صحي</option>
          <option value={"LIFE"}>حياة</option>
          <option value={"CAR"}>سيارات</option>
        </select>
      </div>

      {/* Recommend */}
      <div className="mb-4 flex items-center justify-start gap-2">
        <label className="block mb-1 text-[#121E2C]">
          موصي بها (recommend)
        </label>
        <input
          type="checkbox"
          checked={recommend}
          onChange={(e) => setRecommend(e.target.checked)}
          className="
    w-6 h-6
    accent-[#1c46a2]
    border-2 border-[#1c46a2]
    rounded-md
    cursor-pointer
  "
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block mb-2 text-right">مميزات الباقة</label>

        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 border rounded-lg p-2 text-right"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="أدخل ميزة جديدة"
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-4 rounded-lg"
            onClick={addFeature}>
            إضافة
          </button>
        </div>

        <ul className="space-y-2 text-right">
          {description.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center border p-2 border-gray-200 rounded-lg">
              <span className="text-[#121E2C]">{item}</span>
              <button
                className="text-red-500"
                onClick={() => removeFeature(index)}>
                حذف
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded-lg border"
          onClick={() => navigate("/plans")}>
          إلغاء
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white"
          disabled={isPending}
          onClick={submitHandler}>
          {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </div>
  );
}
