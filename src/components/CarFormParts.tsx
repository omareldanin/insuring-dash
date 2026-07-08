import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";

/* ==================== Types ==================== */
export type Option = { label: string; id: number; isNew?: boolean };

/* ==================== Constants ==================== */
export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_YEAR = 1960;
export const MAX_YEAR = CURRENT_YEAR + 1;

/* ==================== Filter helper ==================== */
export function filterOptionsWithNew(
  options: Option[],
  inputValue: string,
): Option[] {
  const input = inputValue.trim().toLowerCase();
  const filtered = input
    ? options.filter((o) => o.label.toLowerCase().includes(input))
    : [...options];

  const exactMatch = options.some(
    (o) => o.label.trim().toLowerCase() === input,
  );

  if (input && !exactMatch) {
    filtered.push({ label: inputValue.trim(), id: -1, isNew: true });
  }

  return filtered;
}

/* ==================== Field wrapper ==================== */
export function Field({
  label,
  icon,
  hint,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
        {icon && <span className="text-[#1c46a2]">{icon}</span>}
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}

/* ==================== "New" option row ==================== */
export function OptionRow({
  option,
  props,
}: {
  option: Option;
  props: React.HTMLAttributes<HTMLLIElement>;
}) {
  return (
    <li {...props} key={`${option.id}-${option.label}`}>
      <div className="flex items-center gap-2 w-full">
        {option.isNew && (
          <AddIcon fontSize="small" className="text-emerald-600" />
        )}
        <span>{option.label}</span>
        {option.isNew && (
          <Chip
            size="small"
            label="جديد"
            className="ms-auto"
            sx={{
              bgcolor: "#ecfdf5",
              color: "#047857",
              fontSize: 11,
              height: 20,
            }}
          />
        )}
      </div>
    </li>
  );
}
