import { useParams } from "react-router-dom";
import { usePlans } from "../../../hooks/usePlans";
import { useRules } from "../../../hooks/useRules";
import { useEffect, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Loading from "../../../components/loading";
import { HealthTable } from "./table";
import AddHealthRule from "./AddHealthRule";

export default function Filters() {
  const { id } = useParams();
  const [plan, setPlan] = useState<number | null>(null);

  const { data: plans } = usePlans();

  const { data: rules, isLoading } = useRules({
    insuranceCompanyId: id,
    planId: plan ? String(plan) : undefined,
  });

  useEffect(() => {
    if (plans?.results) {
      setPlan(plans?.results.filter((p) => p.insuranceType === "HEALTH")[0].id);
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
            .filter((p) => p.insuranceType === "HEALTH")
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
        <AddHealthRule
          planId={plan}
          insuranceCompanyId={Number(id)}
          rules={rules?.health}
        />
      )}
      {rules && (
        <>
          <HealthTable data={rules.health} />
        </>
      )}
    </div>
  );
}
