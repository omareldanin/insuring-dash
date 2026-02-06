import {
  deleteHealth,
  upsertHealthRules,
  type Health,
} from "../../../services/rules";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../main";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "../../../api/api";
import DeleteDialog from "../../../components/DeleteDialog";
import EditableCell from "../../../components/EditableCell";

interface Props {
  data: Health[];
}

export function HealthTable({ data }: Props) {
  const [ids, setIds] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Health>>({});

  const toggleOne = (id: number) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (ids.length === data.length) {
      setIds([]);
    } else {
      setIds(data.map((r) => r.id));
    }
  };

  const startEdit = (rule: Health) => {
    setEditRowId(rule.id);
    setEditData(rule);
  };

  const saveEdit = () => {
    updateRule({ rules: [editData] });
  };

  const { mutate: deleteRules, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteHealth(ids),
    onSuccess: () => {
      toast.success("تم حذف الفلاتر بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["rules"],
      });
      setIsDialogOpen(false);
      setIds([]);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const { mutate: updateRule, isPending: updateLoading } = useMutation({
    mutationFn: upsertHealthRules,
    onSuccess: () => {
      toast.success("تم التعديل بنجاح");
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      setEditRowId(null);
      setEditData({});
    },
    onError: () => {
      toast.error("حدث خطأ أثناء التعديل");
    },
  });

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold mb-3 text-gray-800">تأمين صحي</h2>
        <button
          disabled={deleteLoading || ids.length === 0}
          onClick={() => setIsDialogOpen(true)}
          className="mb-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
          حذف المحدد ({ids.length})
        </button>
      </div>

      <table className="w-full text-sm text-right border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white shadow-sm">
            <th className="p-2 w-10">
              <input
                type="checkbox"
                checked={data.length > 0 && ids.length === data.length}
                onChange={toggleAll}
              />
            </th>
            <th className="p-2">من</th>
            <th className="p-2">إلى</th>
            <th className="p-2">النوع</th>
            <th className="p-2">السعر</th>
            <th className="p-2">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => {
            const checked = ids.includes(r.id);
            return (
              <tr
                key={r.id}
                className={`bg-white rounded-lg text-gray-700  
          hover:bg-gray-50 ${checked ? "bg-blue-50" : ""}`}>
                <td className="p-3 border-b border-gray-200 h-[50px]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(r.id)}
                  />
                </td>

                <td className="p-3 border-b border-gray-200 h-[50px]">
                  <EditableCell
                    isEditing={editRowId === r.id}
                    type="number"
                    value={editRowId === r.id ? editData.from : r.from}
                    onChange={(v) => setEditData({ ...editData, from: v })}
                  />
                </td>
                <td className="p-3 border-b border-gray-200 h-[50px]">
                  <EditableCell
                    isEditing={editRowId === r.id}
                    type="number"
                    value={editRowId === r.id ? editData.to : r.to}
                    onChange={(v) => setEditData({ ...editData, to: v })}
                  />
                </td>
                <td className="p-3 border-b border-gray-200 h-[50px]">
                  <EditableCell
                    isEditing={editRowId === r.id}
                    type="text"
                    options={[
                      { label: "male", value: "male" },
                      { label: "female", value: "female" },
                    ]}
                    value={editRowId === r.id ? editData.gender : r.gender}
                    onChange={(v) => setEditData({ ...editData, gender: v })}
                  />
                </td>
                <td className="p-3 border-b border-gray-200 h-[50px]">
                  <EditableCell
                    isEditing={editRowId === r.id}
                    type="number"
                    value={editRowId === r.id ? editData.price : r.price}
                    onChange={(v) => setEditData({ ...editData, price: v })}
                  />
                </td>
                <td className="p-3 flex gap-2  border-b border-gray-200 h-[50px]">
                  {editRowId === r.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={updateLoading}
                        className="text-green-600 text-sm">
                        {updateLoading ? "جاري الحفظ..." : "حفظ"}
                      </button>
                      <button
                        onClick={() => {
                          setEditRowId(null);
                          setEditData({});
                        }}
                        className="text-gray-500 text-sm">
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(r)}
                      className="text-blue-600 text-sm">
                      تعديل
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف الفلاتر"
        message="هل أنت متأكد أنك تريد حذف هذه الفلاتر ؟"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteRules();
        }}
      />
    </div>
  );
}
