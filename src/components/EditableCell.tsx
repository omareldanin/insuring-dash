interface EditableCellProps<T = any> {
  isEditing: boolean;
  value: T;
  type?: "text" | "number";
  options?: { label: string; value: any }[]; // 👈 للـ select
  onChange: (value: T) => void;
  className?: string;
}

export default function EditableCell<T>({
  isEditing,
  value,
  type = "text",
  options,
  onChange,
  className = "",
}: EditableCellProps<T>) {
  if (!isEditing) {
    return <span>{String(value)}</span>;
  }

  // ---------- SELECT ----------
  if (options) {
    return (
      <select
        value={value as any}
        onChange={(e) => onChange(e.target.value as any)}
        className={`border rounded px-2 py-1 text-sm w-full ${className}`}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // ---------- INPUT ----------
  return (
    <input
      type={type}
      value={value as any}
      onChange={(e) =>
        onChange(
          type === "number"
            ? (Number(e.target.value) as any)
            : (e.target.value as any),
        )
      }
      className={`border rounded px-2  border-blue-400 text-sm ${className}`}
    />
  );
}
