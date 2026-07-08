"use client";

import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCarOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaidIcon from "@mui/icons-material/PaidOutlined";
import FactoryIcon from "@mui/icons-material/FactoryOutlined";
import AddIcon from "@mui/icons-material/Add";

import { NumberInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { useMakes, useModels } from "../../../hooks/useCars";
import { createCar } from "../../../services/cars";
import { queryClient } from "../../../main";
import type { APIError } from "../../../api/api";

/* ==================== Types ==================== */
type Option = { label: string; id: number; isNew?: boolean };

/* ==================== Constants ==================== */
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1960;
const MAX_YEAR = CURRENT_YEAR + 1;

/* ==================== Component ==================== */
export default function CreateCar() {
  const [make, setMake] = useState<Option | null>(null);
  const [model, setModel] = useState<Option | null>(null);
  const [year, setYear] = useState<number | undefined>();
  const [price, setPrice] = useState<number | undefined>();

  const { data: makes, isLoading: makesLoading } = useMakes();
  const { data: carModels, isLoading: modelsLoading } = useModels(
    make?.id && make.id > 0 ? make.id : null,
  );

  /* ---------------- Options ---------------- */
  const makeOptions: Option[] = useMemo(
    () => makes?.map((m) => ({ label: m.name, id: m.id })) ?? [],
    [makes],
  );

  const modelOptions: Option[] = useMemo(
    () => carModels?.map((m) => ({ label: m.name, id: m.id })) ?? [],
    [carModels],
  );

  /* ---------------- Validation ---------------- */
  const makeText = make?.label.trim() ?? "";
  const modelText = model?.label.trim() ?? "";
  const yearValid = !!year && year >= MIN_YEAR && year <= MAX_YEAR;
  const canSubmit = makeText.length > 0 && modelText.length > 0 && yearValid;

  /* ---------------- Mutation ---------------- */
  const { mutate, isPending } = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      toast.success("تم إضافة السيارة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      resetForm();
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const resetForm = () => {
    setMake(null);
    setModel(null);
    setYear(undefined);
    setPrice(undefined);
  };

  /* ---------------- Handlers ---------------- */
  const filterOptions = (options: Option[], inputValue: string): Option[] => {
    const input = inputValue.trim().toLowerCase();
    const filtered = input
      ? options.filter((o) => o.label.toLowerCase().includes(input))
      : options;

    // Suggest creating a new entry only if there's no exact match
    const exactMatch = options.some(
      (o) => o.label.trim().toLowerCase() === input,
    );

    if (input && !exactMatch) {
      filtered.push({ label: inputValue.trim(), id: -1, isNew: true });
    }

    return filtered;
  };

  const submit = () => {
    if (!canSubmit || isPending) return;

    mutate({
      make: makeText,
      model: modelText,
      year: year!,
      minimumPrice: price ?? 0,
    });
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#121E2C]">إضافة سيارة جديدة</h1>
        <p className="text-sm text-gray-500 mt-1">
          اختر شركة وموديل من القائمة أو أضف جديد
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
        {/* Make */}
        <Field
          label="الشركة"
          icon={<FactoryIcon fontSize="small" />}
          hint="ابدأ بالكتابة لإضافة شركة غير موجودة">
          <Autocomplete
            value={make}
            options={makeOptions}
            loading={makesLoading}
            loadingText="جاري التحميل..."
            noOptionsText="لا توجد نتائج"
            isOptionEqualToValue={(o, v) =>
              o.id === v.id && o.label === v.label
            }
            filterOptions={(opts, state) =>
              filterOptions(opts, state.inputValue)
            }
            onChange={(_, value) => {
              setMake(value);
              // Reset model when make changes
              setModel(null);
            }}
            renderOption={(props, option) => (
              <li {...props} key={`${option.id}-${option.label}`}>
                <div className="flex items-center gap-2 w-full">
                  {option.isNew && (
                    <AddIcon fontSize="small" className="text-emerald-600" />
                  )}
                  <span>{option.label}</span>
                  {option.isNew && (
                    <Chip
                      size="small"
                      label="جديد"
                      className="ms-auto"
                      sx={{
                        bgcolor: "#ecfdf5",
                        color: "#047857",
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                  )}
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="اختر أو أضف شركة" fullWidth />
            )}
          />
        </Field>

        {/* Model */}
        <Field
          label="الموديل"
          icon={<DirectionsCarIcon fontSize="small" />}
          hint={
            !make ? "اختر شركة أولاً" : "ابدأ بالكتابة لإضافة موديل غير موجود"
          }>
          <Autocomplete
            value={model}
            disabled={!make}
            options={modelOptions}
            loading={modelsLoading}
            loadingText="جاري التحميل..."
            noOptionsText="لا توجد نتائج"
            isOptionEqualToValue={(o, v) =>
              o.id === v.id && o.label === v.label
            }
            filterOptions={(opts, state) =>
              filterOptions(opts, state.inputValue)
            }
            onChange={(_, value) => setModel(value)}
            renderOption={(props, option) => (
              <li {...props} key={`${option.id}-${option.label}`}>
                <div className="flex items-center gap-2 w-full">
                  {option.isNew && (
                    <AddIcon fontSize="small" className="text-emerald-600" />
                  )}
                  <span>{option.label}</span>
                  {option.isNew && (
                    <Chip
                      size="small"
                      label="جديد"
                      className="ms-auto"
                      sx={{
                        bgcolor: "#ecfdf5",
                        color: "#047857",
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                  )}
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="اختر أو أضف موديل" fullWidth />
            )}
          />
        </Field>

        {/* Year + Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="سنة الصنع"
            icon={<CalendarMonthIcon fontSize="small" />}
            error={
              year !== undefined && !yearValid
                ? `أدخل سنة بين ${MIN_YEAR} و ${MAX_YEAR}`
                : undefined
            }>
            <NumberInput
              unstyled
              value={year}
              onChange={(val) => setYear(val === "" ? undefined : Number(val))}
              min={MIN_YEAR}
              max={MAX_YEAR}
              placeholder={String(CURRENT_YEAR)}
              classNames={{
                input: `w-full border rounded-lg p-3 text-right transition ${
                  year !== undefined && !yearValid
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`,
              }}
            />
          </Field>

          <Field
            label="السعر الأدنى"
            icon={<PaidIcon fontSize="small" />}
            hint="اختياري">
            <NumberInput
              unstyled
              value={price}
              onChange={(val) => setPrice(val === "" ? undefined : Number(val))}
              min={0}
              thousandSeparator=","
              placeholder="0"
              classNames={{
                input:
                  "w-full border border-gray-300 focus:border-blue-600 rounded-lg p-3 text-right transition",
              }}
            />
          </Field>
        </div>

        {/* Preview strip */}
        {(makeText || modelText || year) && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700">
            <span className="text-gray-500">معاينة: </span>
            <span className="font-medium">
              {makeText || "—"} {modelText || ""} {year ? `(${year})` : ""}
            </span>
            {make?.id === -1 && (
              <Chip
                size="small"
                label="شركة جديدة"
                className="ms-2"
                sx={{ bgcolor: "#ecfdf5", color: "#047857", fontSize: 11 }}
              />
            )}
            {model?.id === -1 && (
              <Chip
                size="small"
                label="موديل جديد"
                className="ms-2"
                sx={{ bgcolor: "#ecfdf5", color: "#047857", fontSize: 11 }}
              />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button
          onClick={resetForm}
          variant="outlined"
          disabled={isPending}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}>
          مسح
        </Button>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || isPending}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition">
          {isPending ? "جاري الحفظ..." : "حفظ السيارة"}
        </button>
      </div>
    </div>
  );
}

/* ==================== Sub-components ==================== */
function Field({
  label,
  icon,
  hint,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
        {icon && <span className="text-[#1c46a2]">{icon}</span>}
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
