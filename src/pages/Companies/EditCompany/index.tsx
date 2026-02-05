"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePlans } from "../../../hooks/usePlans";
import { getCompanyById, updateCompany } from "../../../services/companies";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "../../../api/api";

export default function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: plans } = usePlans();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyType, setCompanyType] = useState<string | undefined>();

  const [insuranceTypes, setInsuranceTypes] = useState<string[]>([]);
  const [companyPlans, setCompanyPlans] = useState<
    { planId: number; features: string[]; featureInput?: string }[]
  >([]);

  // ---------------- Fetch Company ----------------
  const { data: companyData } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(Number(id)),
    enabled: !!id,
  });

  // ---------------- Fill Form ----------------
  useEffect(() => {
    if (!companyData) return;
    console.log(companyData);

    const company = companyData;

    setName(company.name);
    setEmail(company.email);
    setCompanyType(company.companyType);
    setInsuranceTypes(company.insuranceTypes);

    setCompanyPlans(
      company.companyPlans.map((p: any) => ({
        planId: p.planId,
        features: p.features,
      })),
    );
  }, [companyData]);

  // ---------------- Mutation ----------------
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: any) => updateCompany(Number(id), payload),
    onSuccess: () => {
      toast.success("تم تعديل الشركة");
      navigate("/companies");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
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
    const copy = [...companyPlans];
    const feature = copy[index].featureInput?.trim();

    if (!feature) return;

    copy[index].features.push(feature);
    copy[index].featureInput = "";
    setCompanyPlans(copy);
  };

  // ---------------- Submit ----------------
  const submit = () => {
    mutate({
      name,
      email,
      companyType,
      insuranceTypes,
      companyPlans: companyPlans.map((p) => ({
        planId: p.planId,
        features: p.features,
      })),
    });
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-[#121E2C]">تعديل الشركة</h1>

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
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* ---------- Company Type ---------- */}
      <div className="mt-4">
        <Autocomplete
          value={
            companyType
              ? {
                  label: companyType === "SOLIDARITY" ? "تكافلي" : "تجاري",
                  value: companyType,
                }
              : null
          }
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
          value={insuranceTypes.map((v) => ({
            label: v === "CAR" ? "سيارات" : v === "HEALTH" ? "صحي" : "حياه",
            value: v,
          }))}
          options={[
            { label: "سيارات", value: "CAR" },
            { label: "صحي", value: "HEALTH" },
            { label: "حياه", value: "LIFE" },
          ]}
          onChange={(_, value) => setInsuranceTypes(value.map((v) => v.value))}
          renderInput={(params) => (
            <TextField {...params} label="أنواع التأمين" />
          )}
        />
      </div>

      {/* ---------- Company Plans ---------- */}
      <div className="mt-6">
        <h2 className="font-semibold mb-3">باقات الشركة</h2>

        {companyPlans.map((plan, index) => (
          <div key={index} className="border p-4 rounded-xl mb-4">
            <Autocomplete
              value={
                plans?.results
                  .map((p) => ({ label: p.name, id: p.id }))
                  .find((p) => p.id === plan.planId) || null
              }
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
                  <li key={i} className="text-gray-500 mb-1">
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
        {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
      </button>
    </div>
  );
}
