"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useMutation } from "@tanstack/react-query";
import { usePlans } from "../../../hooks/usePlans";
import toast from "react-hot-toast";
import { createCompany } from "../../../services/companies";
import type { AxiosError } from "axios";
import type { APIError } from "../../../api/api";

export default function CreateCompany() {
  const { data: plans } = usePlans();

  const [name, setName] = useState("");
  const [type, setType] = useState("RANGE");
  const [email, setEmail] = useState("");
  const [companyType, setCompanyType] = useState<string | undefined>(undefined);

  const [insuranceTypes, setInsuranceTypes] = useState<string[]>([]);

  const [companyPlans, setCompanyPlans] = useState<
    { planId: number; features: string[]; featureInput?: string }[]
  >([]);

  // ---------------- Mutation ----------------
  const { mutate, isPending } = useMutation({
    mutationFn: createCompany,
    onSuccess: () => toast.success("تم إضافة الشركة"),
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما", {
        duration: 4000,
      });
    },
  });

  // ---------------- Plan handlers ----------------
  const addPlan = () => {
    setCompanyPlans((prev) => [...prev, { planId: 0, features: [] }]);
  };

  const removePlan = (index: number) => {
    setCompanyPlans((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = (index: number) => {
    const plansCopy = [...companyPlans];
    const feature = plansCopy[index].featureInput?.trim();

    if (!feature) return;

    plansCopy[index].features.push(feature);
    plansCopy[index].featureInput = "";

    setCompanyPlans(plansCopy);
  };

  // ---------------- Submit ----------------
  const submit = () => {
    mutate({
      name,
      email,
      companyType,
      insuranceTypes,
      ruleType: type,
      companyPlans: companyPlans.map((p) => ({
        planId: p.planId,
        features: p.features,
      })),
    });
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-[#121E2C]">إضافة شركة</h1>

      {/* ---------- Name ---------- */}
      <TextField
        label="اسم الشركة"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* ---------- Email ---------- */}
      <div className="mt-4">
        <TextField
          label="البريد الإلكتروني"
          style={{ textAlign: "right" }}
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* ---------- Company Type ---------- */}
      <div className="mt-4">
        <Autocomplete
          options={[
            { label: "تكافلي", value: "SOLIDARITY" },
            { label: "تجاري", value: "COMMERCIAL" },
          ]}
          onChange={(_, value) => setCompanyType(value?.value)}
          renderInput={(params) => <TextField {...params} label="نوع الشركة" />}
        />
      </div>

      {/* ---------- Insurance Types ---------- */}
      <div className="mt-4">
        <Autocomplete
          multiple
          options={[
            { label: "سيارات", value: "CAR" },
            { label: "صحي", value: "HEALTH" },
            { label: "حياه", value: "LIFE" },
          ]}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_, value) => {
            const unique = Array.from(
              new Map(value.map((v) => [v.value, v])).values(),
            );

            setInsuranceTypes(unique.map((v) => v.value));
          }}
          renderInput={(params) => (
            <TextField {...params} label="أنواع التأمين" />
          )}
        />
      </div>

      {insuranceTypes.includes("CAR") ? (
        <div className="mt-4">
          <Autocomplete
            options={[
              { label: "مجموعات", value: "GROUP" },
              { label: "مبالغ", value: "RANGE" },
            ]}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(_, value) => setType(value?.value || "")}
            renderInput={(params) => (
              <TextField {...params} label="طريقة اضافة السيارات" />
            )}
          />
        </div>
      ) : null}
      {/* ---------- Company Plans ---------- */}
      <div className="mt-6">
        <h2 className="font-semibold mb-3">باقات الشركة</h2>

        {companyPlans.map((plan, index) => (
          <div key={index} className="border p-4 rounded-xl mb-4">
            {/* Plan Select */}
            <Autocomplete
              options={
                plans?.results.map((p) => ({
                  label: p.name,
                  id: p.id,
                })) || []
              }
              onChange={(_, value) => {
                const copy = [...companyPlans];
                copy[index].planId = value?.id || 0;
                setCompanyPlans(copy);
              }}
              renderInput={(params) => <TextField {...params} label="الباقة" />}
            />

            {/* Features */}
            <div className="mt-3">
              <TextField
                label="إضافة ميزة"
                fullWidth
                value={plan.featureInput || ""}
                onChange={(e) => {
                  const copy = [...companyPlans];
                  copy[index].featureInput = e.target.value;
                  setCompanyPlans(copy);
                }}
              />

              <button
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => addFeature(index)}>
                إضافة ميزة
              </button>

              <ul className="mt-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-md text-gray-500 mb-1">
                    • {f}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="mt-3 text-red-500"
              onClick={() => removePlan(index)}>
              حذف الباقة
            </button>
          </div>
        ))}

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={addPlan}>
          إضافة باقة
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white">
        {isPending ? "جاري الحفظ..." : "حفظ الشركة"}
      </button>
    </div>
  );
}
