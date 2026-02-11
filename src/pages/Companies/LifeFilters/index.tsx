import { useParams } from "react-router-dom";
import { usePlans } from "../../../hooks/usePlans";
import { useRules } from "../../../hooks/useRules";
import { useEffect, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Loading from "../../../components/loading";
import { LifeTable } from "./table";
import AddLifeRule from "./AddLifeRule";

export default function LifeFilters() {
  const { id } = useParams();
  const [plan, setPlan] = useState<number | null>(null);

  const { data: plans } = usePlans();

  const { data: rules, isLoading } = useRules({
    insuranceCompanyId: id,
    planId: plan ? String(plan) : undefined,
  });

  useEffect(() => {
    if (plans?.results) {
      setPlan(plans?.results.filter((p) => p.insuranceType === "LIFE")[0].id);
    }
  }, [plans?.results]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
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
            .filter((p) => p.insuranceType === "LIFE")
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
        <AddLifeRule
          planId={plan}
          insuranceCompanyId={Number(id)}
          rules={rules?.life}
        />
      )}
      {rules && (
        <>
          <LifeTable data={rules.life} />
        </>
      )}
    </div>
  );
}
