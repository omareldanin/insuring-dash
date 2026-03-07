import { useForm } from "react-hook-form";

type ConfirmDocumentForm = {
  status?: string;
  description?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ConfirmDocumentForm) => void;
  loading?: boolean;
};

export default function ConfirmDocumentModal({
  open,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const { register, handleSubmit } = useForm<ConfirmDocumentForm>();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[420px] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-600">
          تحديث حالة التعويض
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Status */}
          <div>
            <label className="text-sm text-gray-600">الحالة</label>
            <select
              {...register("status", { required: true })}
              className="w-full mt-1 p-2 border rounded-lg bg-white">
              <option value="">اختر الحالة</option>
              <option value="processing">تحت المعالجة</option>
              <option value="confirmed">تم الموافقة علي التعويض</option>
              <option value="canceled">تم الرفض</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">رسالة</label>
            <textarea
              {...register("description")}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="اكتب رسالة أو ملاحظة"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-300">
              إلغاء
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
              {loading ? "جاري الحفظ..." : "تأكيد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
