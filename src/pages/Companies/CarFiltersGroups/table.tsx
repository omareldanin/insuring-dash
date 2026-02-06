import { deleteCar } from "../../../services/rules";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../main";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "../../../api/api";
import DeleteDialog from "../../../components/DeleteDialog";
// import EditableCell from "../../../components/EditableCell";

interface Props {
  data: {
    id: number;
    persitage: number;
    createdAt: Date;
    type: string;

    groups: {
      groupName: string;
      cars: {
        makeId: number;
        modelId: number;
        year: number;
        years: number[];
        make: {
          name: string;
        };
        model: {
          name: string;
        };
      }[];
    }[];
  };
}

export function RangeTable({ data }: Props) {
  const [ids, setIds] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [editRowId, setEditRowId] = useState<number | null>(null);
  // const [editData, setEditData] = useState<
  //   Partial<{
  //     id: number;
  //     from: number;
  //     to: number;
  //     persitage: number;
  //     createdAt: Date;
  //     type: string;
  //   }>
  // >({});

  // const toggleOne = (id: number) => {
  //   setIds((prev) =>
  //     prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
  //   );
  // };

  // const toggleAll = () => {
  //   // if (ids.length === data) {
  //   //   setIds([]);
  //   // } else {
  //   //   setIds(data.map((r) => r.id));
  //   // }
  // };

  // const startEdit = (rule: {
  //   id: number;
  //   from: number;
  //   to: number;
  //   persitage: number;
  //   createdAt: Date;
  // }) => {
  //   setEditRowId(rule.id);
  //   setEditData(rule);
  // };

  // const saveEdit = () => {
  //   updateRule({ ...editData, ruleType: "RANGE" });
  // };

  const { mutate: deleteRules, isPending: deleteLoading } = useMutation({
    mutationFn: (ids: number[]) => deleteCar(ids),
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

  // const { mutate: updateRule, isPending: updateLoading } = useMutation({
  //   mutationFn: upsertCarRules,
  //   onSuccess: () => {
  //     toast.success("تم التعديل بنجاح");
  //     queryClient.invalidateQueries({ queryKey: ["rules"] });
  //     setEditRowId(null);
  //     setEditData({});
  //   },
  //   onError: () => {
  //     toast.error("حدث خطأ أثناء التعديل");
  //   },
  // });

  return (
    <div className="mt-7">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold mb-3 text-gray-800">
            اسم المجموعه : {data.groups[0].groupName}
          </h2>
          <h5 className="font-bold mb-3 text-gray-500">
            النسبه : {data.persitage}
          </h5>
        </div>
        <div className="flex gap-2">
          {/* <button
            disabled={deleteLoading || ids.length === 0}
            onClick={() => setIsDialogOpen(true)}
            className="mb-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
            حذف المحدد ({ids.length})
          </button> */}
          <button
            // disabled={deleteLoading || ids.length === 0}
            onClick={() => setIsDialogOpen(true)}
            className="mb-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 ">
            مسح المجموعه
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-right border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white shadow-sm">
            <th className="p-2">السياره</th>
            <th className="p-2">الموديل</th>
            <th className="p-2">السنه</th>
          </tr>
        </thead>
        <tbody>
          {data.groups[0].cars.map((r) => {
            const checked = ids.includes(data.id);
            return (
              <tr
                key={data.id}
                className={`bg-white rounded-lg text-gray-700  
          hover:bg-gray-50 ${checked ? "bg-blue-50" : ""}`}>
                <td className="p-3 border-b border-gray-200 h-[50px]">
                  {r.make.name}
                </td>
                <td className="p-3 border-b border-gray-200 h-[50px]">
                  {r.model.name}
                </td>
                <td className="p-3 border-b border-gray-200 h-[50px]">
                  {r.years.join("-")}
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
          deleteRules([data.id]);
        }}
      />
    </div>
  );
}
