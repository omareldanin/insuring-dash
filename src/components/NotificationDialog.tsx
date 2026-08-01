import { useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import Select from "react-select";
import { sendBroadcastNotification } from "../services/notifications";
import { usersOptions } from "../services/users";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDialog({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);

  const { mutate: send, isPending } = useMutation({
    mutationFn: () => sendBroadcastNotification({ title, content, role }),
    onSuccess: (res) => {
      toast.success(`تم إرسال الإشعار إلى ${res.sentTo ?? ""} مستخدم`);
      setTitle("");
      setContent("");
      setRole(undefined);
      onClose();
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("العنوان والمحتوى مطلوبان");
      return;
    }
    send();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 text-right"
        dir="rtl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#121E2C]">إرسال إشعار</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">العنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الإشعار"
            className="w-full mt-1 p-2 border rounded-lg bg-white text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">المحتوى</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="نص الإشعار"
            rows={4}
            className="w-full mt-1 p-2 border rounded-lg bg-white text-gray-700 placeholder-gray-400 resize-none"
          />
        </div>

        {/* Target role (optional) */}
        <div className="mb-6">
          <label className="text-sm text-gray-600">
            الفئة المستهدفة (اختياري)
          </label>
          <Select
            value={usersOptions?.find((o) => o.value === role) || null}
            options={usersOptions}
            isClearable
            placeholder="الكل"
            className="mt-1 text-gray-900"
            onChange={(opt) => setRole(opt ? opt.value : undefined)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white px-4 py-2 rounded-lg disabled:opacity-60">
            {isPending ? "جاري الإرسال..." : "إرسال"}
          </button>
        </div>
      </div>
    </div>
  );
}
