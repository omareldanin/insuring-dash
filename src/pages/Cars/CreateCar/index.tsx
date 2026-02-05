"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { useMakes, useModels } from "../../../hooks/useCars";
import { NumberInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { createCar } from "../../../services/cars";
import toast from "react-hot-toast";
import { queryClient } from "../../../main";
import type { AxiosError } from "axios";
import type { APIError } from "../../../api/api";

export default function CreateCar() {
  const [makeId, setMakeId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);

  const [makeValue, setMakeValue] = useState("");
  const [modelValue, setModelValue] = useState("");

  const [year, setYear] = useState<number | undefined>();
  const [price, setPrice] = useState<number | undefined>();

  // ---------------- Makes ----------------
  const { data: makes } = useMakes();
  const { data: carModels } = useModels(makeId);

  // ---------------- Create Car ----------------

  const { mutate, isPending } = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      toast.success("تم إضافة السياره بنجاح");
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
  // ---------------- Handlers ----------------

  const submit = () => {
    if (!modelId || !year) return;
    mutate({
      make: makeValue,
      model: modelValue,
      year: year,
      minimumPrice: price || 0,
    });
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">
        إضافة سياره جديده
      </h1>
      {/* <div className="flex flex-col gap-5"> */}
      {/* ---------- MAKE ---------- */}
      <div className="mt-5">
        <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
          الشركة
        </label>

        <Autocomplete
          options={makes?.map((m) => ({ label: m.name, id: m.id })) || []}
          getOptionLabel={(option) => option.label}
          sx={{
            width: "100%",
          }}
          filterOptions={(options, state) => {
            const filtered = options.filter((o) =>
              o.label.toLowerCase().includes(state.inputValue.toLowerCase()),
            );

            if (state.inputValue !== "") {
              filtered.push({
                label: state.inputValue,
                id: -1,
              });
            }

            return filtered;
          }}
          onChange={(_event, value) => {
            if (!value) return;

            setMakeId(value.id);
            setMakeValue(value.label);
          }}
          renderInput={(params) => (
            <TextField {...params} label="الشركة" fullWidth />
          )}
        />
      </div>

      {/* ---------- MODEL ---------- */}
      <div className="mt-5">
        <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
          الموديل
        </label>

        <Autocomplete
          disablePortal
          options={carModels?.map((m) => ({ label: m.name, id: m.id })) || []}
          sx={{ width: "100%", direction: "rtl" }}
          filterOptions={(options, state) => {
            const filtered = options.filter((o) =>
              o.label.toLowerCase().includes(state.inputValue.toLowerCase()),
            );

            if (state.inputValue !== "") {
              filtered.push({
                label: state.inputValue,
                id: -1,
              });
            }

            return filtered;
          }}
          onChange={(_event, value) => {
            if (!value) return;

            setModelId(value.id);
            setModelValue(value.label);
          }}
          renderInput={(params) => (
            <TextField {...params} label="الموديل" value={modelValue} />
          )}
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
              "w-full border-1 border-gray-300 focus:border-blue-600 rounded-md p-3 text-right",
          }}
        />
      </div>

      {/* ---------- PRICE ---------- */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
          السعر الأدنى
        </label>

        <NumberInput
          unstyled
          value={price}
          onChange={(val) => setPrice(Number(val))}
          classNames={{
            input:
              "w-full border-1 border-gray-300 focus:border-blue-600 rounded-md p-3 text-right",
          }}
        />
      </div>

      {/* ---------- SUBMIT ---------- */}
      <button
        onClick={submit}
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white">
        {isPending ? "جاري الحفظ..." : "حفظ"}
      </button>
      {/* </div> */}
    </div>
  );
}
