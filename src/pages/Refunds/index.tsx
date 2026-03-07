"use client";

import { useState } from "react";
import Loading from "../../components/loading";
import Pagination from "../../components/Pagintation";
import { useNavigate } from "react-router-dom";
import { useDocumentsRefunds } from "../../hooks/useDocuments";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import { DocumentStatusData, updateRefund } from "../../services/refunds";
import ConfirmDocumentModal from "./ConfirmDocumentModal";

export default function DocumentsReFunds() {
  const navigation = useNavigate();
  const [id, setId] = useState<number | null>(null);
  const [filter, setFilters] = useState<{
    page?: number;
    size?: number;
    userId?: number;
    documentId?: number;
    confirmed?: boolean;
    paid?: boolean;
  }>({
    page: 1,
    size: 10,
  });

  const { data, isLoading } = useDocumentsRefunds(filter);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateRefund(id, data),
    onSuccess: () => {
      toast.success("تم تجديد الوثيقه");
      setConfirmOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["refunds"],
      });
    },
    onError: () => {
      toast.error("حدث خطأ");
    },
  });

  const handleConfirm = (data: any) => {
    if (id) {
      updateMutation.mutate({
        id: id,
        data,
      });
    }
  };

  return (
    <div className="relative pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            التعويضات - {data?.data.total.toLocaleString()}
          </h1>
          <p className="text-sm text-gray-500 mb-3">إدارة طلبات التعويض</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl pt-4 pb-10">
        {/* Search */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5  p-3">
          <div>
            <Autocomplete
              options={[
                { label: "تم التأكيد", value: true },
                { label: "لم يتم التأكيد", value: false },
              ]}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onChange={(_, value) => {
                if (!value) {
                  setFilters((pre) => ({ ...pre, confirmed: undefined }));
                } else {
                  setFilters((pre) => ({
                    ...pre,
                    confirmed: value.value,
                  }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="حالة التأكيد" />
              )}
            />
          </div>
        </div> */}
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="w-full overflow-auto">
              <table className="min-w-[1200px] text-sm text-right border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white shadow-sm">
                    <th className="p-2">#</th>
                    <th className="p-2">اسم المستخدم</th>
                    <th className="p-2">رقم الهاتف</th>
                    <th className="p-2">الشركه</th>
                    <th className="p-2">رقم الوثيقة</th>
                    <th className="p-2">رقم السياره</th>
                    <th className="p-2">الحاله</th>
                    <th className="p-2">تاريخ الانشاء</th>
                    <th className="p-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data.data.map((document) => {
                    return (
                      <tr
                        key={document.id}
                        className="bg-white rounded-lg text-gray-700 border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-200">
                          {document.id}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.insuranceDocument?.user.name}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.insuranceDocument?.user.phone}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.insuranceDocument.company.name}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.insuranceDocument.documentNumber ? (
                            <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full w-fit">
                              📄 {document.insuranceDocument.documentNumber}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-amber-700 bg-amber-100 rounded-full w-fit">
                              ⏳ قيد الانتظار
                            </span>
                          )}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full w-fit">
                            {document.carNumber}
                          </span>
                        </td>

                        <td className="p-3 border-b border-gray-200">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                              DocumentStatusData[document.status].className
                            }`}>
                            {DocumentStatusData[document.status].icon}{" "}
                            {DocumentStatusData[document.status].name}
                          </span>
                        </td>

                        <td className="p-3 border-b border-gray-200">
                          <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                            {new Date(document.createdAt).toLocaleDateString(
                              "ar-EG",
                            )}
                          </span>
                        </td>

                        <td className="p-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            {/* Show Details */}
                            <button
                              onClick={() =>
                                navigation(
                                  `/documents/${document.insuranceDocument.id}`,
                                )
                              }
                              className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
                              عرض التفاصيل
                            </button>
                            <button
                              onClick={() => {
                                setConfirmOpen(true);
                                setId(document.id);
                              }}
                              className={`px-3 py-1 text-xs font-medium rounded-lg transition
                                ${"bg-green-100 text-green-700 hover:bg-green-200"}
                            `}>
                              تغيير الحاله
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {data?.data.total === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد سيارات</p>
              </div>
            ) : null}
            <Pagination
              page={filter.page || 1}
              totalPages={data?.data.totalPages || 1}
              onPageChange={(page) => {
                setFilters((pre) => ({ ...pre, page: page }));
              }}
            />
          </>
        )}
      </div>
      <ConfirmDocumentModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSubmit={handleConfirm}
        loading={updateMutation.isPending}
      />
    </div>
  );
}
