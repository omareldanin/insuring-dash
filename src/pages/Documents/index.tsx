"use client";

import { useState } from "react";
import Loading from "../../components/loading";
import Pagination from "../../components/Pagintation";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { useCompanies } from "../../hooks/useCompanies";
import { Autocomplete, TextField } from "@mui/material";
import {
  confirmDocument,
  type GetDocumentParams,
} from "../../services/documents";
import { usePlans } from "../../hooks/usePlans";
import type { InsuranceType } from "../../services/plans";
import { useMutation } from "@tanstack/react-query";
import ConfirmDocumentModal from "./ConfirmDocumentModal";
import toast from "react-hot-toast";
import { queryClient } from "../../main";

export default function Documents() {
  const navigation = useNavigate();
  const [id, setId] = useState<number | null>(null);
  const [filter, setFilters] = useState<GetDocumentParams>({
    page: 1,
    size: 10,
  });
  const { data: companies } = useCompanies({ page: 1, size: 1000 });
  const { data: plans } = usePlans();

  const { data, isLoading } = useDocuments(filter);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      confirmDocument(id, data),
    onSuccess: () => {
      toast.success("تم تأكيد الوثيقه");
      setConfirmOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["documents"],
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
            إدارة الوثائق - {data?.data.total.toLocaleString()}
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            إدارة جميع الوثائق التي تم انشائها
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl pt-4 pb-10">
        {/* Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5  p-3">
          <div>
            <Autocomplete
              options={
                companies?.data.map((m) => ({ label: m.name, id: m.id })) || []
              }
              getOptionLabel={(option) => option.label}
              sx={{
                width: "100%",
              }}
              onChange={(_event, value) => {
                if (!value) {
                  setFilters((pre) => ({ ...pre, companyId: undefined }));
                } else {
                  setFilters((pre) => ({ ...pre, companyId: +value.id }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="الشركة" fullWidth />
              )}
            />
          </div>
          <div>
            <Autocomplete
              options={
                plans?.results.map((m) => ({ label: m.name, id: m.id })) || []
              }
              getOptionLabel={(option) => option.label}
              sx={{
                width: "100%",
              }}
              onChange={(_event, value) => {
                if (!value) {
                  setFilters((pre) => ({ ...pre, planId: undefined }));
                } else {
                  setFilters((pre) => ({ ...pre, planId: +value.id }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="الباقه" fullWidth />
              )}
            />
          </div>
          <div>
            <Autocomplete
              options={[
                { label: "سيارات", value: "CAR" },
                { label: "صحي", value: "HEALTH" },
                { label: "حياه", value: "LIFE" },
              ]}
              getOptionLabel={(option) => option.label}
              sx={{
                width: "100%",
              }}
              onChange={(_event, value) => {
                if (!value) {
                  setFilters((pre) => ({ ...pre, insuranceType: undefined }));
                } else {
                  setFilters((pre) => ({
                    ...pre,
                    insuranceType: value.value as InsuranceType,
                  }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="نوع التأمين" fullWidth />
              )}
            />
          </div>

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
        </div>
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
                    <th className="p-2">نوع التأمين</th>
                    <th className="p-2">الحاله</th>
                    <th className="p-2">تاريخ الاصدار</th>
                    <th className="p-2">تاريخ الانتهاء</th>
                    <th className="p-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data.data?.map((document) => {
                    return (
                      <tr
                        key={document.id}
                        className="bg-white rounded-lg text-gray-700 border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-200">
                          {document.id}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.user.name}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.user.phone}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.company.name}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.documentNumber ? (
                            <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full w-fit">
                              📄 {document.documentNumber}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-amber-700 bg-amber-100 rounded-full w-fit">
                              ⏳ قيد الانتظار
                            </span>
                          )}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.insuranceType === "HEALTH" &&
                          document.healthInfo?.groupName
                            ? "صحي جماعي"
                            : document.insuranceType === "HEALTH"
                              ? "صحي"
                              : document.insuranceType === "CAR"
                                ? "سيارات"
                                : "حياه"}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 w-fit ${
                              document.confirmed
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            }`}>
                            {document.confirmed
                              ? "✔ تم التأكيد"
                              : "✖ لم يتم التأكيد"}
                          </span>
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          {document.startDate ? (
                            <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                              {new Date(document.startDate).toLocaleDateString(
                                "ar-EG",
                              )}
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                              قيد الانتظار
                            </span>
                          )}
                        </td>

                        <td className="p-3 border-b border-gray-200">
                          {document.endDate ? (
                            <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                              {new Date(document.endDate).toLocaleDateString(
                                "ar-EG",
                              )}
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                              قيد الانتظار
                            </span>
                          )}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            {/* Show Details */}
                            <button
                              onClick={() =>
                                navigation(`/documents/${document.id}`)
                              }
                              className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
                              عرض التفاصيل
                            </button>

                            {/* Confirm */}
                            <button
                              onClick={() => {
                                setConfirmOpen(true);
                                setId(document.id);
                              }}
                              disabled={document.confirmed}
                              className={`px-3 py-1 text-xs font-medium rounded-lg transition
                                ${
                                  document.confirmed
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }
                            `}>
                              تأكيد
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
