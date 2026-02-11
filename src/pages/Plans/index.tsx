"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlans } from "../../hooks/usePlans";
import { deletePlan } from "../../services/plans";
import Loading from "../../components/loading";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import type { AxiosError } from "axios";
import type { APIError } from "../../api/api";
import DeleteDialog from "../../components/DeleteDialog";

export default function Plans() {
  const navigation = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  const { data, isLoading } = usePlans();

  const { mutate: deletePlansById, isPending: deleteLoading } = useMutation({
    mutationFn: () => deletePlan(id),
    onSuccess: () => {
      toast.success("تم حذف الباقه بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["plans"],
      });
      setIsDialogOpen(false);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  return (
    <div className="relative pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            إدارة الباقات
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            إدارة جميع الباقات الخاصه بأنواع التأمين
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => navigation("/plans/add")}>
          + إضافة باقه جديده
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl pt-4 pb-10">
        {/* Search */}

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <table className="w-full text-sm text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white shadow-sm">
                  <th className="p-2">#</th>
                  <th className="p-2">الاسم</th>
                  <th className="p-2">وصف مختصر</th>
                  <th className="p-2">نوع التأمين</th>
                  <th className="p-2">موصي بها ؟</th>
                  <th className="p-2">تاريخ الانشاء</th>
                  <th className="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.results.map((plan) => {
                  const create = new Date(plan.createdAt);

                  return (
                    <tr
                      key={plan.id}
                      className="bg-white rounded-lg text-gray-700 border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 border-b border-gray-200">
                        {plan.id}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {plan.name}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {plan.hint || "لا يوجد"}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {plan.insuranceType === "HEALTH" && plan.forHealthGroups
                          ? "صحي جماعي"
                          : plan.insuranceType === "HEALTH"
                            ? "صحي"
                            : plan.insuranceType === "CAR"
                              ? "سيارات"
                              : "حياه"}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {plan.recommend ? "نعم" : "لا"}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {create.toLocaleString()}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        <div className="flex gap-2">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setIsDialogOpen(true);
                              setId(plan.id);
                            }}>
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              navigation(`/plans/edit/${plan.id}`);
                            }}>
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data?.results.length === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد باقات</p>
              </div>
            ) : null}
          </>
        )}
      </div>
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف الباقه"
        message="هل أنت متأكد أنك تريد حذف هذه الباقه؟"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deletePlansById();
        }}
      />
    </div>
  );
}
