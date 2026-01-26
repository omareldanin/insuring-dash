import { DotSpinner } from "ldrs/react";
import type { ReactNode } from "react";

interface DeleteDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string | ReactNode;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteDialog({
  isOpen,
  title = "تأكيد الحذف",
  message = "هل أنت متأكد أنك تريد حذف هذا العنصر؟",
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* العنوان */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>

        {/* الرسالة */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* الأزرار */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            {isLoading ? (
              <DotSpinner size="18" speed="0.9" color="#fff" />
            ) : (
              "تأكيد"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
