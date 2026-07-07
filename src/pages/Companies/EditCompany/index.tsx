"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LinkIcon from "@mui/icons-material/LinkOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalanceOutlined";
import AddIcon from "@mui/icons-material/Add";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { usePlans } from "../../../hooks/usePlans";
import { getCompanyById, updateCompany } from "../../../services/companies";
import type { APIError } from "../../../api/api";
import Loading from "../../../components/loading";

import {
  Section,
  LogoUploader,
  PaymentTypeCard,
  PlanCard,
  COMPANY_TYPES,
  INSURANCE_TYPES,
  INSURANCE_TYPE_LABEL,
  type CompanyPlan,
  type PaymentType,
} from "../../../components/CompanyFormParts";

export default function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: plans } = usePlans();

  // Basic
  const [name, setName] = useState("");
  const [arName, setArName] = useState("");
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [companyType, setCompanyType] = useState<string | undefined>();
  const [insuranceTypes, setInsuranceTypes] = useState<string[]>([]);

  // Logo
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Payment
  const [paymentType, setPaymentType] = useState<PaymentType>("");
  const [paymentLink, setPaymentLink] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Plans
  const [companyPlans, setCompanyPlans] = useState<CompanyPlan[]>([]);

  /* ---------------- Fetch company ---------------- */
  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(Number(id)),
    enabled: !!id,
  });

  /* ---------------- Prefill form ---------------- */
  useEffect(() => {
    if (!companyData) return;
    const c: any = companyData;

    setName(c.name || "");
    setArName(c.arName || "");
    setEmail(c.email || "");
    setLink(c.refundEmail || "");
    setCompanyType(c.companyType);
    setInsuranceTypes(c.insuranceTypes || []);

    // Payment prefill
    setPaymentType(c.paymentType || "");
    setPaymentLink(c.paymentLink || "");
    setBankName(c.bankName || "");
    setAccountNumber(c.accountNumber || "");

    // Existing logo preview
    if (c.logo) {
      const base = import.meta.env.VITE_API_URL || "";
      setLogoPreview(base ? `${base}/${c.logo}` : `/${c.logo}`);
    }

    setCompanyPlans(
      (c.companyPlans || []).map((p: any) => ({
        planId: p.planId,
        features: p.features,
        arFeatures: p.arFeatures,
      })),
    );
  }, [companyData]);

  /* ---------------- Handlers ---------------- */
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const addPlan = () =>
    setCompanyPlans((prev) => [
      ...prev,
      { planId: 0, features: [], arFeatures: [] },
    ]);

  const removePlan = (index: number) =>
    setCompanyPlans((prev) => prev.filter((_, i) => i !== index));

  const addFeature = (index: number) => {
    const copy = [...companyPlans];
    const feature = copy[index].featureInput?.trim();
    const arfeature = copy[index].arfeatureInput?.trim();
    if (!feature || !arfeature) return;

    copy[index].features.push(feature);
    copy[index].arFeatures.push(arfeature);
    copy[index].featureInput = "";
    copy[index].arfeatureInput = "";
    setCompanyPlans(copy);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const copy = [...companyPlans];
    copy[planIndex].features.splice(featureIndex, 1);
    copy[planIndex].arFeatures.splice(featureIndex, 1);
    setCompanyPlans(copy);
  };

  const updatePlanField = <K extends keyof CompanyPlan>(
    index: number,
    key: K,
    value: CompanyPlan[K],
  ) => {
    const copy = [...companyPlans];
    copy[index][key] = value;
    setCompanyPlans(copy);
  };

  /* ---------------- Mutation ---------------- */
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

  /* ---------------- Submit ---------------- */
  const submit = () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("arName", arName);
    formData.append("email", email);
    if (companyType) formData.append("companyType", companyType);
    insuranceTypes.forEach((t) => formData.append("insuranceTypes[]", t));

    if (paymentType) {
      formData.append("paymentType", paymentType);
      if (paymentType === "PAYMENT_LINK") {
        formData.append("paymentLink", paymentLink);
      } else if (paymentType === "BANK_ACCOUNT") {
        formData.append("bankName", bankName);
        formData.append("accountNumber", accountNumber);
      }
    }

    formData.append(
      "companyPlans",
      JSON.stringify(
        companyPlans.map((p) => ({
          planId: p.planId,
          features: p.features,
          arFeatures: p.arFeatures,
        })),
      ),
    );

    if (logo) formData.append("image", logo);
    if (link) formData.append("link", link);

    mutate(formData);
  };

  if (isLoading) return <Loading />;

  /* ---------------- Controlled Autocomplete values ---------------- */
  const companyTypeValue = companyType
    ? COMPANY_TYPES.find((o) => o.value === companyType) || null
    : null;

  const insuranceTypesValue = insuranceTypes.map((v) => ({
    label: INSURANCE_TYPE_LABEL[v] || v,
    value: v,
  }));

  /* ---------------- Render ---------------- */
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#121E2C]">تعديل الشركة</h1>
        <p className="text-sm text-gray-500 mt-1">
          حدّث بيانات الشركة، طريقة الدفع، والباقات
        </p>
      </div>

      <div className="space-y-5">
        {/* Logo */}
        <Section title="شعار الشركة" icon={<ImageIcon fontSize="small" />}>
          <LogoUploader preview={logoPreview} onChange={handleLogoChange} />
        </Section>

        {/* Basic Info */}
        <Section
          title="البيانات الأساسية"
          icon={<BusinessIcon fontSize="small" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="اسم الشركة (بالإنجليزية)"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="اسم الشركة (بالعربية)"
              fullWidth
              value={arName}
              onChange={(e) => setArName(e.target.value)}
            />
            <TextField
              label="البريد الإلكتروني"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="البريد الخاص بالتعويضات"
              fullWidth
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <Autocomplete
              value={companyTypeValue}
              options={COMPANY_TYPES}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_, value) => setCompanyType(value?.value)}
              renderInput={(params) => (
                <TextField {...params} label="نوع الشركة" />
              )}
            />
            <Autocomplete
              multiple
              value={insuranceTypesValue}
              options={INSURANCE_TYPES}
              isOptionEqualToValue={(o, v) => o.value === v.value}
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
        </Section>

        {/* Payment */}
        <Section
          title="طريقة الدفع"
          icon={<PaymentsIcon fontSize="small" />}
          description="اختر طريقة دفع واحدة يتم إرسالها للعميل عند شراء الوثيقة">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <PaymentTypeCard
              icon={<LinkIcon />}
              title="رابط دفع"
              description="إرسال رابط دفع مباشر للعميل"
              active={paymentType === "PAYMENT_LINK"}
              onClick={() => setPaymentType("PAYMENT_LINK")}
            />
            <PaymentTypeCard
              icon={<AccountBalanceIcon />}
              title="حساب بنكي"
              description="اسم البنك ورقم الحساب للتحويل"
              active={paymentType === "BANK_ACCOUNT"}
              onClick={() => setPaymentType("BANK_ACCOUNT")}
            />
          </div>

          {paymentType === "PAYMENT_LINK" && (
            <TextField
              label="رابط الدفع"
              placeholder="https://..."
              fullWidth
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
            />
          )}

          {paymentType === "BANK_ACCOUNT" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="اسم البنك"
                fullWidth
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <TextField
                label="رقم الحساب"
                fullWidth
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          )}
        </Section>

        {/* Plans */}
        <Section
          title="باقات الشركة"
          icon={<WorkspacePremiumIcon fontSize="small" />}>
          {companyPlans.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              لا توجد باقات بعد. أضف باقة للبدء.
            </div>
          ) : (
            <div className="space-y-4">
              {companyPlans.map((plan, index) => (
                <PlanCard
                  key={index}
                  index={index}
                  plan={plan}
                  plansOptions={plans?.results || []}
                  onUpdateField={updatePlanField}
                  onAddFeature={addFeature}
                  onRemoveFeature={removeFeature}
                  onRemovePlan={removePlan}
                />
              ))}
            </div>
          )}

          <Button
            type="button"
            onClick={addPlan}
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            sx={{ mt: 3, borderRadius: 2, textTransform: "none" }}>
            إضافة باقة
          </Button>
        </Section>
      </div>

      {/* Sticky footer */}
      <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-white/85 backdrop-blur py-4 border-t border-gray-100 -mx-4 md:-mx-6 px-4 md:px-6">
        <Button
          onClick={() => navigate("/companies")}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}>
          إلغاء
        </Button>
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed transition">
          {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </div>
  );
}
