import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

const isImage = (url: string) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(url);

export default function FileInput({
  label,
  current,
  onChange,
}: {
  label: string;
  current?: string; // full url of existing file (baseURL + path)
  onChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  // build/cleanup object URL for the newly selected file
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
    onChange(file);
  };

  const shown = preview ?? (current && isImage(current) ? current : null);

  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
          {shown ? (
            <img
              src={shown}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload size={18} className="text-gray-300" />
          )}
        </div>
        <label className="cursor-pointer text-xs font-medium text-[#1c46a2] bg-[#1c46a2]/10 px-3 py-1.5 rounded-lg hover:bg-[#1c46a2]/20 transition">
          {preview ? "تم الاختيار" : "تغيير الملف"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handle}
          />
        </label>
      </div>
    </div>
  );
}
