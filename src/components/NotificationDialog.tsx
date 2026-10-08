"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import Select from "react-select";
import {
  sendBroadcastNotification,
  type SendBroadcastParams,
} from "../services/notifications";
import { usersOptions } from "../services/users";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedUserIds?: number[];
}

export default function NotificationDialog({
  isOpen,
  onClose,
  selectedUserIds,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [role, setRole] = useState<string | undefined>();
  const [type, setType] = useState<"push" | "whatsapp">("push");
  const isSelectedMode = selectedUserIds !== undefined;

  const { mutate: send, isPending } = useMutation({
    mutationFn: (payload: SendBroadcastParams) =>
      sendBroadcastNotification(payload),
    onSuccess: (res) => {
      const { successCount, failureCount, sentTo } = res;

      if (sentTo === 0) {
        toast.error("لا يوجد مستخدمون مؤهلون للإرسال ضمن الاختيار الحالي");
      } else if (failureCount > 0) {
        const message = `تم قبول ${successCount} طلب إرسال وفشل ${failureCount}`;
        if (successCount === 0) toast.error(message);
        else toast(message, { icon: "⚠️" });
      } else {
        toast.success(`تم قبول ${successCount} طلب إرسال إلى ${sentTo} مستخدم`);
      }

      // The Users page unmounts this dialog on close, resetting its fields.
      onClose();
    },
    onError: (error: AxiosError<APIError>) => {
      const message = error.response?.data.message;
      toast.error(
        Array.isArray(message)
          ? message.join("، ")
          : typeof message === "string"
            ? message
            : "حدث خطأ أثناء الإرسال",
      );
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    if (!content.trim()) {
      toast.error("المحتوى مطلوب");
      return;
    }

    // Never turn an empty explicit selection into a broadcast to everyone.
    if (isSelectedMode && selectedUserIds.length === 0) {
      toast.error("اختر مستخدمًا واحدًا على الأقل");
      return;
    }

    send({
      ...(title.trim() ? { title: title.trim() } : { title: "notification" }),
      content: content.trim(),
      type,
      ...(isSelectedMode
        ? { userIds: [...new Set(selectedUserIds)] }
        : role
          ? { role }
          : {}),
    });
  };

  const fieldClass =
    "w-full mt-1 p-2 border rounded-lg bg-white text-gray-700 placeholder-gray-400 disabled:opacity-60";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-dialog-title"
        aria-busy={isPending}
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 text-right max-h-[90vh] overflow-y-auto"
        dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="notification-dialog-title"
            className="text-lg font-bold text-[#121E2C]">
            إرسال إشعار
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="إغلاق"
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
          {isSelectedMode
            ? `سيتم الإرسال إلى المستخدمين المحددين فقط (${selectedUserIds.length})`
            : role
              ? `سيتم الإرسال إلى فئة: ${usersOptions.find((option) => option.value === role)?.label ?? role}`
              : "سيتم الإرسال إلى جميع المستخدمين المؤهلين للقناة المختارة"}
        </div>

        <div className="mb-4">
          <label
            htmlFor="notification-channel"
            className="text-sm text-gray-600">
            طريقة الإرسال
          </label>
          <select
            id="notification-channel"
            value={type}
            disabled={isPending}
            onChange={(event) =>
              setType(event.target.value === "whatsapp" ? "whatsapp" : "push")
            }
            className={fieldClass}>
            <option value="push">إشعار التطبيق</option>
            <option value="whatsapp">واتساب</option>
          </select>
        </div>

        {type !== "whatsapp" && (
          <div className="mb-4">
            <label
              htmlFor="notification-title"
              className="text-sm text-gray-600">
              العنوان (اختياري)
            </label>
            <input
              id="notification-title"
              type="text"
              value={title}
              disabled={isPending}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="عنوان الإشعار"
              className={fieldClass}
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="notification-content"
            className="text-sm text-gray-600">
            المحتوى
          </label>
          <textarea
            id="notification-content"
            value={content}
            required
            disabled={isPending}
            onChange={(event) => setContent(event.target.value)}
            placeholder="نص الإشعار"
            rows={4}
            className={`${fieldClass} resize-none`}
          />
        </div>

        {!isSelectedMode && (
          <div className="mb-6">
            <label
              htmlFor="notification-role"
              className="text-sm text-gray-600">
              الفئة المستهدفة (اختياري)
            </label>
            <Select
              inputId="notification-role"
              value={
                usersOptions.find((option) => option.value === role) ?? null
              }
              options={usersOptions}
              isClearable
              isRtl
              isDisabled={isPending}
              placeholder="الكل"
              className="mt-1 text-gray-900"
              onChange={(option) => setRole(option?.value)}
            />
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-60">
            إلغاء
          </button>
          <button
            type="submit"
            disabled={
              isPending || (isSelectedMode && selectedUserIds.length === 0)
            }
            className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white px-4 py-2 rounded-lg disabled:opacity-60">
            {isPending ? "جاري الإرسال..." : "إرسال"}
          </button>
        </div>
      </form>
    </div>
  );
}
