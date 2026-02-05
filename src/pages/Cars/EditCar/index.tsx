"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { NumberInput } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMakes, useModels } from "../../../hooks/useCars";
import { getCarById, updateCar } from "../../../services/cars";
import toast from "react-hot-toast";
import { queryClient } from "../../../main";
import type { AxiosError } from "axios";
import type { APIError } from "../../../api/api";

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [makeId, setMakeId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);

  const [makeValue, setMakeValue] = useState("");
  const [modelValue, setModelValue] = useState("");

  const [year, setYear] = useState<number | undefined>();
  const [price, setPrice] = useState<number | undefined>();

  // ---------------- Fetch Car ----------------
  const { data: carData } = useQuery({
    queryKey: ["car", id],
    queryFn: () => getCarById(Number(id)),
    enabled: !!id,
  });

  // ---------------- Makes / Models ----------------
  const { data: makes } = useMakes();
  const { data: carModels } = useModels(makeId);

  // ---------------- Fill form ----------------
  useEffect(() => {
    if (!carData) return;

    const car = carData;

    setMakeId(car.model.make.id);
    setModelId(car.model.id);

    setMakeValue(car.model.make.name);
    setModelValue(car.model.name);

    setYear(car.year);
    setPrice(car.minimumPrice);
  }, [carData]);

  // ---------------- Update Mutation ----------------
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

  // ---------------- Submit ----------------
  const submit = () => {
    if (!modelId || !year) return;

    mutate({
      make: makeValue,
      model: modelValue,
      year,
      minimumPrice: price || 0,
    });
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">تعديل السيارة</h1>

      {/* ---------- MAKE ---------- */}
      <div className="mt-5">
        <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
          الشركة
        </label>

        <Autocomplete
          options={makes?.map((m) => ({ label: m.name, id: m.id })) || []}
          getOptionLabel={(option) => option.label}
          sx={{ width: "100%" }}
          value={makeValue ? { label: makeValue, id: makeId ?? -1 } : null}
          onChange={(_, value) => {
            if (!value) return;

            setMakeId(value.id);
            setMakeValue(value.label);
            setModelId(null);
            setModelValue("");
          }}
          renderInput={(params) => <TextField {...params} label="الشركة" />}
        />
      </div>

      {/* ---------- MODEL ---------- */}
      <div className="mt-5">
        <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
          الموديل
        </label>

        <Autocomplete
          options={carModels?.map((m) => ({ label: m.name, id: m.id })) || []}
          getOptionLabel={(option) => option.label}
          sx={{ width: "100%" }}
          value={modelValue ? { label: modelValue, id: modelId ?? -1 } : null}
          onChange={(_, value) => {
            if (!value) return;

            setModelId(value.id);
            setModelValue(value.label);
          }}
          renderInput={(params) => <TextField {...params} label="الموديل" />}
        />
      </div>

      {/* ---------- YEAR ---------- */}
      <div className="mt-5">
        <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
          السنة
        </label>

        <NumberInput
          unstyled
          value={year}
          onChange={(val) => setYear(Number(val))}
          classNames={{
            input:
              "w-full border border-gray-300 focus:border-blue-600 rounded-md p-3 text-right",
          }}
        />
      </div>

      {/* ---------- PRICE ---------- */}
      <div className="mt-5">
        <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
          السعر الأدنى
        </label>

        <NumberInput
          unstyled
          value={price}
          onChange={(val) => setPrice(Number(val))}
          classNames={{
            input:
              "w-full border border-gray-300 focus:border-blue-600 rounded-md p-3 text-right",
          }}
        />
      </div>

      {/* ---------- SUBMIT ---------- */}
      <button
        onClick={submit}
        className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white">
        {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
      </button>
    </div>
  );
}
