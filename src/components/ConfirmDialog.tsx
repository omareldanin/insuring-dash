import type { ReactNode } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string | ReactNode;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = "تأكيد العملية",
  message = "هل أنت متأكد أنك تريد المتابعة؟",
  cancelText = "إلغاء",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* العنوان */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>

        {/* الرسالة */}
        <div className="text-gray-600 mb-6">{message}</div>

        {/* الأزرار */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
            {isLoading ? "جاري التآكيد..." : "تأكيد"}
          </button>
        </div>
      </div>
    </div>
  );
}
