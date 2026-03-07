"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";

interface OfferFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { insuranceTypes: string[]; discount: number }) => void;
  initialData?: {
    insuranceTypes: string[];
    discount: number;
  };
  loading?: boolean;
}

const insuranceOptions = [
  { label: "سيارات", value: "CAR" },
  { label: "صحي", value: "HEALTH" },
  { label: "حياة", value: "LIFE" },
];

export default function OfferFormDialog({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
}: OfferFormDialogProps) {
  const [discount, setDiscount] = useState<number>(0);
  const [insuranceTypes, setInsuranceTypes] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setDiscount(initialData.discount);
      setInsuranceTypes(initialData.insuranceTypes);
    } else {
      setDiscount(0);
      setInsuranceTypes([]);
    }
  }, [initialData, open]);

  const submit = () => {
    onSubmit({
      discount,
      insuranceTypes,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "تعديل العرض" : "إضافة عرض"}</DialogTitle>

      <DialogContent>
        {/* Discount */}
        <TextField
          label="نسبة الخصم %"
          type="number"
          fullWidth
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          sx={{ mt: 2 }}
        />

        {/* Insurance Types */}
        <Autocomplete
          multiple
          sx={{ mt: 3 }}
          options={insuranceOptions}
          getOptionLabel={(o) => o.label}
          value={insuranceOptions.filter((o) =>
            insuranceTypes.includes(o.value),
          )}
          onChange={(_, values) =>
            setInsuranceTypes(values.map((v) => v.value))
          }
          renderInput={(params) => (
            <TextField {...params} label="أنواع التأمين" />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={submit}
          sx={{
            background: "linear-gradient(90deg,#1c46a2,#31e5b7)",
          }}>
          {loading ? "جاري الحفظ..." : initialData ? "تحديث" : "إضافة"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
