"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCarOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaidIcon from "@mui/icons-material/PaidOutlined";
import FactoryIcon from "@mui/icons-material/FactoryOutlined";
import { NumberInput } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { useMakes, useModels } from "../../../hooks/useCars";
import { getCarById, updateCar } from "../../../services/cars";
import { queryClient } from "../../../main";
import type { APIError } from "../../../api/api";
import Loading from "../../../components/loading";

import {
  Field,
  OptionRow,
  filterOptionsWithNew,
  CURRENT_YEAR,
  MIN_YEAR,
  MAX_YEAR,
  type Option,
} from "../../../components/CarFormParts";

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [make, setMake] = useState<Option | null>(null);
  const [model, setModel] = useState<Option | null>(null);
  const [year, setYear] = useState<number | undefined>();
  const [price, setPrice] = useState<number | undefined>();

  /* ---------------- Fetch car ---------------- */
  const { data: carData, isLoading: carLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => getCarById(Number(id)),
    enabled: !!id,
  });

  /* ---------------- Makes / Models ---------------- */
  const { data: makes, isLoading: makesLoading } = useMakes();
  const { data: carModels, isLoading: modelsLoading } = useModels(
    make?.id && make.id > 0 ? make.id : null,
  );

  const makeOptions: Option[] = useMemo(
    () => makes?.map((m) => ({ label: m.name, id: m.id })) ?? [],
    [makes],
  );

  const modelOptions: Option[] = useMemo(
    () => carModels?.map((m) => ({ label: m.name, id: m.id })) ?? [],
    [carModels],
  );

  /* ---------------- Prefill ---------------- */
  useEffect(() => {
    if (!carData) return;
    const c: any = carData;

    setMake({ label: c.model.make.name, id: c.model.make.id });
    setModel({ label: c.model.name, id: c.model.id });
    setYear(c.year);
    setPrice(c.minimumPrice);
  }, [carData]);

  /* ---------------- Validation ---------------- */
  const makeText = make?.label.trim() ?? "";
  const modelText = model?.label.trim() ?? "";
  const yearValid = !!year && year >= MIN_YEAR && year <= MAX_YEAR;
  const canSubmit = makeText.length > 0 && modelText.length > 0 && yearValid;

  /* ---------------- Dirty check ---------------- */
  const original = carData as any;
  const isDirty =
    !!original &&
    (make?.label !== original.model.make.name ||
      model?.label !== original.model.name ||
      year !== original.year ||
      (price ?? 0) !== (original.minimumPrice ?? 0));

  /* ---------------- Mutation ---------------- */
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: any) => updateCar(payload, Number(id)),
    onSuccess: () => {
      toast.success("تم تعديل السيارة");
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      navigate("/cars");
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  /* ---------------- Submit ---------------- */
  const submit = () => {
    if (!canSubmit || isPending) return;
    mutate({
      make: makeText,
      model: modelText,
      year: year!,
      minimumPrice: price ?? 0,
    });
  };

  if (carLoading) return <Loading />;

  /* ---------------- Render ---------------- */
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#121E2C]">تعديل السيارة</h1>
        <p className="text-sm text-gray-500 mt-1">
          حدّث بيانات السيارة أو غيّر الشركة والموديل
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
              filterOptionsWithNew(opts, state.inputValue)
            }
            onChange={(_, value) => {
              setMake(value);
              // Only reset model if the make actually changed
              if (value?.label !== original?.model?.make?.name) {
                setModel(null);
              } else {
                setModel({
                  label: original.model.name,
                  id: original.model.id,
                });
              }
            }}
            renderOption={(props, option) => (
              <OptionRow props={props} option={option} />
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
              filterOptionsWithNew(opts, state.inputValue)
            }
            onChange={(_, value) => setModel(value)}
            renderOption={(props, option) => (
              <OptionRow props={props} option={option} />
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
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 flex items-center flex-wrap gap-2">
            <span className="text-gray-500">معاينة:</span>
            <span className="font-medium">
              {makeText || "—"} {modelText || ""} {year ? `(${year})` : ""}
            </span>
            {make?.id === -1 && (
              <Chip
                size="small"
                label="شركة جديدة"
                sx={{ bgcolor: "#ecfdf5", color: "#047857", fontSize: 11 }}
              />
            )}
            {model?.id === -1 && (
              <Chip
                size="small"
                label="موديل جديد"
                sx={{ bgcolor: "#ecfdf5", color: "#047857", fontSize: 11 }}
              />
            )}
            {isDirty && (
              <Chip
                size="small"
                label="تغييرات غير محفوظة"
                sx={{ bgcolor: "#fef3c7", color: "#92400e", fontSize: 11 }}
              />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-white/85 backdrop-blur py-4 border-t border-gray-100 -mx-4 md:-mx-6 px-4 md:px-6">
        <Button
          onClick={() => navigate("/cars")}
          variant="outlined"
          disabled={isPending}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}>
          إلغاء
        </Button>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || !isDirty || isPending}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition">
          {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </div>
  );
}
