"use client";

import { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../../main";
import type { AxiosError } from "axios";
import type { APIError } from "../../../api/api";
import { upsertCarRules, type Car } from "../../../services/rules";

interface Props {
  planId: number;
  insuranceCompanyId: number;
  rules?: Car;
}

export default function AddCarRule({
  planId,
  insuranceCompanyId,
  rules,
}: Props) {
  const [from, setFrom] = useState<number | undefined>();
  const [to, setTo] = useState<number | undefined>();
  const [type, setType] = useState<"used" | "new" | null>(null);
  const [persitage, setPersitage] = useState<number | undefined>();

  const { mutate, isPending } = useMutation({
    mutationFn: upsertCarRules,
    onSuccess: () => {
      toast.success("تمت إضافة الفلتر بنجاح");
      queryClient.invalidateQueries({ queryKey: ["rules"] });

      // reset
      setFrom(undefined);
      setTo(undefined);
      setType(null);
      setPersitage(undefined);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const submit = () => {
    if ((!from && from !== 0) || !to || !type || !persitage) {
      toast.error("من فضلك أكمل جميع الحقول");
      return;
    }

    if (to <= from) {
      toast.error("القيمة (إلي) يجب ان تكون اكبر من القيمه (من)", {
        duration: 5000,
      });
      return;
    }
    const filteredRules =
      type === "new" ? rules?.new?.range : rules?.used?.range;

    for (const r of filteredRules || []) {
      if (from >= r.from && from <= r.to) {
        toast.error("القيمة (من) موجودة مسبقاً", {
          duration: 5000,
        });
        return;
      }
    }

    mutate({
      from,
      to,
      type,
      persitage,
      insuranceType: "CAR",
      planId,
      insuranceCompanyId,
      ruleType: "RANGE",
    });
  };

  return (
    <div className="bg-gray-50 border rounded-xl p-4 mb-6">
      <h3 className="font-semibold mb-4 text-gray-700">إضافة فلتر جديد</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TextField
          label="من"
          type="number"
          value={from ?? ""}
          onChange={(e) => setFrom(Number(e.target.value))}
        />

        <TextField
          label="إلى"
          type="number"
          value={to ?? ""}
          onChange={(e) => setTo(Number(e.target.value))}
        />

        <Autocomplete
          options={[
            { label: "جديد", value: "new" },
            { label: "مستعمل", value: "used" },
          ]}
          value={
            type
              ? {
                  label: type === "new" ? "جديد" : "مستعمل",
                  value: type,
                }
              : null
          }
          onChange={(_, v) => setType(v?.value as "new" | "used" | null)}
          renderInput={(params) => <TextField {...params} label="النوع" />}
        />

        <TextField
          label="النسبه"
          type="number"
          value={persitage ?? ""}
          onChange={(e) => setPersitage(Number(e.target.value))}
        />
      </div>

      <button
        onClick={submit}
        disabled={isPending}
        className="mt-4 bg-gradient-to-r from-[#1c46a2] to-[#31e5b7]
                   text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
        {isPending ? "جاري الإضافة..." : "إضافة"}
      </button>
    </div>
  );
}
