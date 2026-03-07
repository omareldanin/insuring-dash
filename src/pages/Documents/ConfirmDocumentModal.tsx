import { useForm } from "react-hook-form";

type ConfirmDocumentForm = {
  documentNumber: string;
  startDate: string;
  endDate: string;
  link?: string;
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
        <h2 className="text-lg font-semibold text-gray-600">تأكيد الوثيقة</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Document Number */}
          <div>
            <label className="text-sm text-gray-600">رقم الوثيقة</label>
            <input
              {...register("documentNumber", { required: true })}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="DOC-12345"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="text-sm text-gray-600">تاريخ الإصدار</label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-sm text-gray-600">تاريخ الانتهاء</label>
            <input
              type="date"
              {...register("endDate", { required: true })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Payment Key */}
          <div>
            <label className="text-sm text-gray-600">رابط الدفع</label>
            <input
              {...register("link")}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="Payment reference"
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
              {loading ? "جاري التأكيد..." : "تأكيد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
