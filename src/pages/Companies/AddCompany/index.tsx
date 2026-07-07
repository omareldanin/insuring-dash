"use client";

import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LinkIcon from "@mui/icons-material/LinkOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalanceOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { usePlans } from "../../../hooks/usePlans";
import { createCompany } from "../../../services/companies";
import type { APIError } from "../../../api/api";

/* ==================== Types ==================== */
type PaymentType = "PAYMENT_LINK" | "BANK_ACCOUNT" | "";

type CompanyPlan = {
  planId: number;
  features: string[];
  arFeatures: string[];
  featureInput?: string;
  arfeatureInput?: string;
};

type Option<T = string> = { label: string; value: T };

/* ==================== Constants ==================== */
const COMPANY_TYPES: Option[] = [
  { label: "تكافلي", value: "SOLIDARITY" },
  { label: "تجاري", value: "COMMERCIAL" },
];

const INSURANCE_TYPES: Option[] = [
  { label: "سيارات", value: "CAR" },
  { label: "صحي", value: "HEALTH" },
  { label: "حياه", value: "LIFE" },
];

/* ==================== Page ==================== */
export default function CreateCompany() {
  const { data: plans } = usePlans();
  const navigate = useNavigate();

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

  /* ---------------- Handlers (unchanged logic) ---------------- */
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
    mutationFn: createCompany,
    onSuccess: () => {
      toast.success("تم إضافة الشركة");
      navigate("/companies");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما", {
        duration: 4000,
      });
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

    // Payment method
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

  /* ---------------- Render ---------------- */
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6" dir="rtl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#121E2C]">إضافة شركة تأمين</h1>
        <p className="text-sm text-gray-500 mt-1">
          أدخل بيانات الشركة، اختر طريقة الدفع، وأضف الباقات المتاحة
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
              options={COMPANY_TYPES}
              onChange={(_, value) => setCompanyType(value?.value)}
              renderInput={(params) => (
                <TextField {...params} label="نوع الشركة" />
              )}
            />
            <Autocomplete
              multiple
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

        {/* Payment Method */}
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

      {/* Sticky footer actions */}
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
          {isPending ? "جاري الحفظ..." : "حفظ الشركة"}
        </button>
      </div>
    </div>
  );
}

/* ==================== Sub-components ==================== */

function Section({
  title,
  icon,
  description,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#1c46a2]">{icon}</span>
        <h2 className="font-semibold text-[#121E2C] text-base">{title}</h2>
      </div>
      {description && (
        <p className="text-xs text-gray-500 mb-4">{description}</p>
      )}
      {!description && <div className="mb-4" />}
      {children}
    </section>
  );
}

function LogoUploader({
  preview,
  onChange,
}: {
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 border border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden shrink-0">
        {preview ? (
          <img
            src={preview}
            alt="Company Logo"
            className="w-full h-full object-contain"
          />
        ) : (
          <ImageIcon className="text-gray-400" fontSize="large" />
        )}
      </div>
      <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2 px-4 rounded-lg transition">
        <CloudUploadIcon fontSize="small" />
        {preview ? "تغيير الصورة" : "رفع صورة"}
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  );
}

function PaymentTypeCard({
  icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-right p-4 rounded-xl border transition ${
        active
          ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500"
          : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50/60"
      }`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={active ? "text-blue-600" : "text-gray-500"}>
          {icon}
        </span>
        <span
          className={`font-semibold text-sm ${
            active ? "text-blue-800" : "text-gray-800"
          }`}>
          {title}
        </span>
        {active && (
          <span className="ms-auto text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            محدد
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </button>
  );
}

function PlanCard({
  index,
  plan,
  plansOptions,
  onUpdateField,
  onAddFeature,
  onRemoveFeature,
  onRemovePlan,
}: {
  index: number;
  plan: CompanyPlan;
  plansOptions: { id: number; name: string }[];
  onUpdateField: <K extends keyof CompanyPlan>(
    index: number,
    key: K,
    value: CompanyPlan[K],
  ) => void;
  onAddFeature: (index: number) => void;
  onRemoveFeature: (planIndex: number, featureIndex: number) => void;
  onRemovePlan: (index: number) => void;
}) {
  const options = useMemo(
    () => plansOptions.map((p) => ({ label: p.name, id: p.id })),
    [plansOptions],
  );

  const selectedOption = options.find((o) => o.id === plan.planId) || null;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/60">
      <div className="flex items-start gap-2 mb-3">
        <div className="flex-1">
          <Autocomplete
            value={selectedOption}
            options={options}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            onChange={(_, value) =>
              onUpdateField(index, "planId", value?.id || 0)
            }
            renderInput={(params) => (
              <TextField {...params} label="اختيار الباقة" size="small" />
            )}
          />
        </div>
        <IconButton
          onClick={() => onRemovePlan(index)}
          color="error"
          aria-label="حذف الباقة"
          size="small">
          <DeleteOutlineIcon />
        </IconButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField
          label="ميزة بالإنجليزية"
          size="small"
          fullWidth
          value={plan.featureInput || ""}
          onChange={(e) => onUpdateField(index, "featureInput", e.target.value)}
        />
        <TextField
          label="ميزة بالعربية"
          size="small"
          fullWidth
          value={plan.arfeatureInput || ""}
          onChange={(e) =>
            onUpdateField(index, "arfeatureInput", e.target.value)
          }
        />
      </div>

      <Button
        type="button"
        onClick={() => onAddFeature(index)}
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        sx={{
          mt: 2,
          borderRadius: 2,
          textTransform: "none",
          bgcolor: "#1c46a2",
          "&:hover": { bgcolor: "#153875" },
        }}>
        إضافة ميزة
      </Button>

      {plan.features.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {plan.features.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <CheckCircleIcon
                  className="text-emerald-500"
                  fontSize="small"
                />
                <span className="text-gray-700">
                  {f} — {plan.arFeatures[i]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFeature(index, i)}
                className="text-red-400 hover:text-red-600 p-1"
                aria-label="حذف الميزة">
                <CloseIcon fontSize="small" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
