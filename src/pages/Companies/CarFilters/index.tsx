import { useParams } from "react-router-dom";
import { usePlans } from "../../../hooks/usePlans";
import { useRules } from "../../../hooks/useRules";
import { useEffect, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Loading from "../../../components/loading";
import { RangeTable } from "./table";
import AddCarRule from "./AddCarRule";

export default function CarFilters() {
  const { id } = useParams();
  const [plan, setPlan] = useState<number | null>(null);

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

      {plan && (
        <AddCarRule
          planId={plan}
          insuranceCompanyId={Number(id)}
          rules={rules?.car}
        />
      )}
      <h3 className="font-bold mb-3 text-red-800 text-center">
        السيارات الجديده
      </h3>
      {rules?.car.new?.range.length ? (
        <>
          <RangeTable data={rules.car.new.range} />
        </>
      ) : (
        <p className="font-bold mb-3 text-gray-800 text-center">لا يوجد</p>
      )}
      <h3 className="font-bold mb-3 text-red-800 text-center mt-10">
        السيارات المستعمله
      </h3>

      {rules?.car.used?.range && rules?.car.used ? (
        <>
          <RangeTable data={rules.car.used.range} />
        </>
      ) : (
        <p className="font-bold mb-3 text-gray-800 text-center">لا يوجد</p>
      )}
    </div>
  );
}
