import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Autocomplete,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getMakes, getModels, getYears } from "../../../services/cars";
import { upsertCarRules } from "../../../services/rules";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../../main";

type CarType = "new" | "used";

type Props = {
  open: boolean;
  onClose: () => void;
  existingGroupRules: any[];
  defaultType: CarType;

  planId: number;
  insuranceCompanyId: number;
};

export function GroupDialog({
  open,
  onClose,
  existingGroupRules,
  defaultType,
  planId,
  insuranceCompanyId,
}: Props) {
  const [mode, setMode] = useState<"create" | "append">("create");
  const [type] = useState<CarType>(defaultType);

  const [groupName, setGroupName] = useState("");

  /* ---------- Groups Names ---------- */
  const existingGroupNames = useMemo(() => {
    const names = new Set<{ name: string; id: number }>();
    for (const rule of existingGroupRules || []) {
      for (const g of rule.groups || [])
        names.add({ name: g.groupName, id: rule.id });
    }
    return Array.from(names);
  }, [existingGroupRules]);

  /* ---------- Cars Data ---------- */
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [persitage, setPersitage] = useState<string>("0");

  const [makeId, setMakeId] = useState<number | "">("");
  const [modelId, setModelId] = useState<number | "">("");
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");

  /* ---------- Load Makes ---------- */
  useEffect(() => {
    getMakes().then(setMakes);
  }, []);

  /* ---------- Load Models ---------- */
  useEffect(() => {
    if (makeId) {
      getModels(makeId).then(setModels);
    } else {
      setModels([]);
      setModelId("");
    }
  }, [makeId]);

  /* ---------- Load Years ---------- */
  useEffect(() => {
    if (modelId) {
      getYears(modelId).then((res) => setYears(res));
    } else {
      setYears([]);
      setSelectedYears([]);
    }
  }, [modelId]);

  const { mutate: updateRule, isPending: updateLoading } = useMutation({
    mutationFn: upsertCarRules,
    onSuccess: () => {
      toast.success("تم التعديل بنجاح");
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      setMakeId("");
      setModelId("");
      setMode("create");
      setGroupName("");
      setSelectedYears([]);
      onClose();
    },
    onError: () => {
      toast.error("حدث خطأ أثناء التعديل");
    },
  });

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    const payload: any = {
      ruleType: "GROUP",
      persitage: +persitage,
      insuranceType: "CAR",
      type,
      planId,
      insuranceCompanyId,
      groups: [
        {
          groupName,
          cars: [
            {
              makeId,
              modelId,
              years: selectedYears,
            },
          ],
        },
      ],
    };

    // append فقط
    if (mode === "append") {
      payload.id = selectedRuleId;
    }
    console.log(payload);
    updateRule(payload);
    // await onSubmi    t(payload);
    // onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "إنشاء مجموعة جديدة" : "إضافة سيارات إلى مجموعة"}
      </DialogTitle>

      <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
        {/* ---------- Mode ---------- */}
        <FormControl fullWidth>
          <Select value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <MenuItem value="create">إنشاء مجموعة جديدة</MenuItem>
            <MenuItem value="append">إضافة إلى مجموعة موجودة</MenuItem>
          </Select>
        </FormControl>

        {/* ---------- Group Name ---------- */}
        {mode === "create" ? (
          <TextField
            label="اسم المجموعة"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
          />
        ) : (
          <TextField
            select
            label="اسم المجموعة"
            value={selectedRuleId}
            onChange={(e) => {
              setPersitage(
                existingGroupRules.find((r) => r.id === e.target.value)
                  .persitage,
              );
              console.log(
                existingGroupRules.find((r) => r.id === e.target.value)
                  .groups[0].groupName,
              );

              setGroupName(
                existingGroupRules.find((r) => r.id === e.target.value)
                  .groups[0].groupName,
              );
              setSelectedRuleId(e.target.value);
            }}
            fullWidth>
            {existingGroupNames.map((n) => (
              <MenuItem key={n.name} value={n.id}>
                {n.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        {/* ---------- Rule ---------- */}
        <FormControl fullWidth>
          <TextField
            label="نسبه التأمين"
            value={persitage}
            onChange={(e) => setPersitage(e.target.value)}
            fullWidth
          />
        </FormControl>

        {/* ---------- Make ---------- */}
        <Autocomplete
          options={makes}
          getOptionLabel={(option) => option.name}
          value={makes.find((m) => m.id === makeId) || null}
          onChange={(_, newValue) => {
            setMakeId(newValue ? newValue.id : "");
            setModelId("");
          }}
          renderInput={(params) => (
            <TextField {...params} label="الماركة" fullWidth />
          )}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
        />

        {/* ---------- Model ---------- */}
        <Autocomplete
          options={models}
          getOptionLabel={(option) => option.name}
          value={models.find((m) => m.id === modelId) || null}
          onChange={(_, newValue) => {
            setModelId(newValue ? newValue.id : "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="الموديل"
              fullWidth
              disabled={!makeId}
            />
          )}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
        />

        {/* ---------- Years ---------- */}
        <FormControl fullWidth disabled={!modelId}>
          <InputLabel>سنوات الصنع</InputLabel>
          <Select
            multiple
            label="سنوات الصنع"
            value={selectedYears}
            renderValue={(selected) => selected.join(", ")}
            onChange={(e) => setSelectedYears(e.target.value as number[])}>
            {years.map((y) => (
              <MenuItem key={y.year} value={y.year}>
                <Checkbox checked={selectedYears.includes(y.year)} />
                <ListItemText primary={y.year} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !groupName ||
            !makeId ||
            !modelId ||
            selectedYears.length === 0 ||
            (mode === "append" && !selectedRuleId)
          }>
          {updateLoading ? "جاري الحفظ.." : "حفظ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
