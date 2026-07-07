import { useMemo } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";

/* ==================== Types ==================== */
export type PaymentType = "PAYMENT_LINK" | "BANK_ACCOUNT" | "";

export type CompanyPlan = {
  planId: number;
  features: string[];
  arFeatures: string[];
  featureInput?: string;
  arfeatureInput?: string;
};

export type Option<T = string> = { label: string; value: T };

/* ==================== Constants ==================== */
export const COMPANY_TYPES: Option[] = [
  { label: "تكافلي", value: "SOLIDARITY" },
  { label: "تجاري", value: "COMMERCIAL" },
];

export const INSURANCE_TYPES: Option[] = [
  { label: "سيارات", value: "CAR" },
  { label: "صحي", value: "HEALTH" },
  { label: "حياه", value: "LIFE" },
];

export const INSURANCE_TYPE_LABEL: Record<string, string> = {
  CAR: "سيارات",
  HEALTH: "صحي",
  LIFE: "حياه",
};

/* ==================== Section ==================== */
export function Section({
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
      {description ? (
        <p className="text-xs text-gray-500 mb-4">{description}</p>
      ) : (
        <div className="mb-4" />
      )}
      {children}
    </section>
  );
}

/* ==================== Logo uploader ==================== */
export function LogoUploader({
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

/* ==================== Payment type card ==================== */
export function PaymentTypeCard({
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

/* ==================== Plan card ==================== */
export function PlanCard({
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
