import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export default function DateFilter({
  onChange,
}: {
  onChange: (range: { from: Date; to: Date } | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [option, setOption] = useState<string>("");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const labels: Record<string, string> = {
    "": "اختيار التاريخ",
    "24h": "آخر ٢٤ ساعة",
    week: "آخر أسبوع",
    month: "آخر شهر",
    custom: "تخصيص...",
    clear: "إلغاء التحديد",
  };

  const handleSelect = (value: string) => {
    setOption(value);

    if (value === "24h") {
      onChange({ from: daysAgo(1), to: new Date() });
    } else if (value === "week") {
      onChange({ from: daysAgo(7), to: new Date() });
    } else if (value === "month") {
      onChange({ from: daysAgo(30), to: new Date() });
    } else if (value === "clear") {
      setOption("");
      setCustomRange({ from: "", to: "" });
      onChange(null); // RESET FILTER
    } else if (value === "custom") {
      setShowCustom(true);
    }

    setOpen(false);
  };

  const daysAgo = (num: number) => {
    const d = new Date();
    d.setDate(d.getDate() - num);
    return d;
  };

  const handleCustom = () => {
    if (customRange.from || customRange.to) {
      onChange({
        from: customRange.from ? new Date(customRange.from) : daysAgo(30),
        to: customRange.to ? new Date(customRange.to) : new Date(),
      });
      setShowCustom(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div ref={dropdownRef} className="relative w-full">
        {/* Button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-white border p-2 rounded-md shadow-sm text-gray-700 hover:bg-gray-100 transition">
          <span>
            {option === "custom" && customRange.from
              ? customRange.from +
                (customRange.to ? ` | ${customRange.to}` : "")
              : labels[option]}
          </span>

          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <ChevronDown
              size={18}
              className={`transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute bg-white border shadow-md rounded-md mt-2 w-full z-20 animate-fadeIn">
            <div
              className="p-2 cursor-pointer hover:bg-gray-100 text-gray-700"
              onClick={() => handleSelect("24h")}>
              آخر ٢٤ ساعة
            </div>

            <div
              className="p-2 cursor-pointer hover:bg-gray-100 text-gray-700"
              onClick={() => handleSelect("week")}>
              آخر أسبوع
            </div>

            <div
              className="p-2 cursor-pointer hover:bg-gray-100 text-gray-700"
              onClick={() => handleSelect("month")}>
              آخر شهر
            </div>

            <div
              className="p-2 cursor-pointer hover:bg-gray-100 text-purple-600 font-semibold"
              onClick={() => handleSelect("custom")}>
              تخصيص...
            </div>

            {/* RESET OPTION */}
            <div
              className="p-2 cursor-pointer hover:bg-red-50 text-red-500 font-semibold border-t border-gray-200"
              onClick={() => handleSelect("clear")}>
              إلغاء التحديد
            </div>
          </div>
        )}
      </div>

      {/* Calendar Range Picker */}
      {option === "custom" && showCustom && (
        <div className="mt-3 p-3 bg-white border rounded-md shadow-sm absolute w-full z-10">
          <label className="text-sm text-gray-700">من</label>
          <input
            type="date"
            className="w-full border rounded-md p-2 mt-1 text-gray-700"
            value={customRange.from}
            onChange={(e) =>
              setCustomRange({ ...customRange, from: e.target.value })
            }
          />

          <label className="text-sm text-gray-700 mt-3 block">إلى</label>
          <input
            type="date"
            className="w-full border rounded-md p-2 mt-1 text-gray-700"
            value={customRange.to}
            onChange={(e) =>
              setCustomRange({ ...customRange, to: e.target.value })
            }
          />

          <button
            onClick={handleCustom}
            className="mt-3 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
            تطبيق
          </button>
        </div>
      )}
    </div>
  );
}
