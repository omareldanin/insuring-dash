import { useParams } from "react-router-dom";
import { usePlans } from "../../../hooks/usePlans";
import { useRules } from "../../../hooks/useRules";
import { useEffect, useState } from "react";
import { Tabs, Tab, Box, Button } from "@mui/material";
import Loading from "../../../components/loading";
import { RangeTable } from "./table";
import { GroupDialog } from "./GroupDialog";

export default function CarFiltersGroups() {
  const { id } = useParams();
  const [plan, setPlan] = useState<number | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [openUsed, setOpenUsed] = useState(false);

  const { data: plans } = usePlans();

  const { data: rules, isLoading } = useRules({
    insuranceCompanyId: id,
    planId: plan ? String(plan) : undefined,
  });

  useEffect(() => {
    if (plans?.results) {
      setPlan(plans?.results.filter((p) => p.insuranceType === "CAR")[0].id);
    }
  }, [plans?.results]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      {/* ---------- Plans Tabs ---------- */}
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}>
        <Tabs
          value={plan}
          onChange={(_, value) => setPlan(value)}
          variant="fullWidth">
          {plans?.results
            .filter((p) => p.insuranceType === "CAR")
            .map((p) => (
              <Tab
                key={p.id}
                value={p.id}
                label={p.name}
                sx={{
                  fontSize: 13,
                  flex: 1,
                  fontWeight: 600,
                }}
              />
            ))}
        </Tabs>
      </Box>

      {/* ---------- Content ---------- */}
      {isLoading && <Loading />}

      <div className="flex justify-between items-center mt-4">
        <h3 className="font-bold text-red-800 flex-1">السيارات الجديده</h3>
        <Button variant="contained" onClick={() => setOpenNew(true)}>
          إضافة مجموعة / إضافة سيارات
        </Button>
      </div>

      {rules?.car.new?.groups.length ? (
        rules?.car.new?.groups.map((group) => <RangeTable data={group} />)
      ) : (
        <p className="font-bold mb-3 text-gray-800 text-center">لا يوجد</p>
      )}

      <span
        style={{
          display: "block",
          width: "100%",
          height: "2px",
          backgroundColor: "#f3130fff",
          marginTop: "30px",
        }}></span>
      <div className="flex justify-between items-center mt-10">
        <h3 className="font-bold text-red-800 flex-1">السيارات المستعمله</h3>
        <Button variant="contained" onClick={() => setOpenUsed(true)}>
          إضافة مجموعة / إضافة سيارات
        </Button>
      </div>

      {rules?.car.used?.groups.length ? (
        rules?.car.used?.groups.map((group) => <RangeTable data={group} />)
      ) : (
        <p className="font-bold mb-3 text-gray-800 text-center">لا يوجد</p>
      )}
      <GroupDialog
        open={openNew}
        onClose={() => setOpenNew(false)}
        existingGroupRules={rules?.car?.new?.groups || []}
        defaultType="new"
        planId={plan || 0}
        insuranceCompanyId={id ? +id : 0}
      />

      <GroupDialog
        open={openUsed}
        onClose={() => setOpenUsed(false)}
        existingGroupRules={rules?.car?.used?.groups || []}
        defaultType="used"
        planId={plan || 0}
        insuranceCompanyId={id ? +id : 0}
      />
    </div>
  );
}
