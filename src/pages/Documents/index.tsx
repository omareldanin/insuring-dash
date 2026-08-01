"use client";

import { useState } from "react";
import {
  FileSearch,
  RotateCcw,
  Eye,
  CheckCircle2,
  Edit,
  Trash2,
} from "lucide-react";
import Loading from "../../components/loading";
import Pagination from "../../components/Pagintation";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { useCompanies } from "../../hooks/useCompanies";
import { Autocomplete, TextField } from "@mui/material";
import {
  confirmDocument,
  deleteDocument,
  type GetDocumentParams,
} from "../../services/documents";
import { usePlans } from "../../hooks/usePlans";
import type { InsuranceType } from "../../services/plans";
import { useMutation } from "@tanstack/react-query";
import ConfirmDocumentModal from "./ConfirmDocumentModal";
import DeleteDialog from "../../components/DeleteDialog";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "../../api/api";
import { queryClient } from "../../main";
import { useAuth } from "../../store/authStore";
import { useUsers } from "../../hooks/useUsers";
import Select from "react-select";
import {
  ConfirmBadge,
  DocumentNumberBadge,
  DateBadge,
  getInsuranceTypeLabel,
} from "./DocumentBadges";

const INITIAL_FILTERS: GetDocumentParams = { page: 1, size: 10 };

const INSURANCE_TYPES = [
  { label: "سيارات", value: "CAR" },
  { label: "صحي", value: "HEALTH" },
  { label: "حياه", value: "LIFE" },
];

const CONFIRM_STATUS = [
  { label: "تم التأكيد", value: true },
  { label: "لم يتم التأكيد", value: false },
];

export default function Documents() {
  const navigation = useNavigate();
  const { role } = useAuth();
  const [id, setId] = useState<number | null>(null);
  const [filter, setFilters] = useState<GetDocumentParams>(INITIAL_FILTERS);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: companies } = useCompanies({ page: 1, size: 1000 });
  const { data: plans } = usePlans();
  const { data: partners } = useUsers({ role: "PARTNER", page: 1, size: 1000 });
  const { data, isLoading } = useDocuments(filter);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      confirmDocument(id, data),
    onSuccess: () => {
      toast.success("تم تأكيد الوثيقه");
      setConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: () => toast.error("حدث خطأ"),
  });

  const { mutate: removeDocument, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteDocument(deleteId!),
    onSuccess: () => {
      toast.success("تم حذف الوثيقة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setDeleteOpen(false);
      setDeleteId(null);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleConfirm = (data: any) => {
    if (id) updateMutation.mutate({ id, data });
  };

  const partnerOptions =
    partners?.results.map((p) => ({ value: String(p.id), label: p.name })) ??
    [];

  const total = data?.data.total ?? 0;
  const documents = data?.data.data ?? [];

  // هل يوجد أي فلتر مفعّل (غير الصفحة والحجم)
  const hasActiveFilters = Object.keys(filter).some(
    (k) => !["page", "size"].includes(k) && (filter as any)[k] !== undefined,
  );

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <div className="relative pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#121E2C] m-0">
              إدارة الوثائق
            </h1>
            <span className="px-3 py-1 text-sm font-semibold text-[#1c46a2] bg-[#1c46a2]/10 rounded-full">
              {total.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-500 m-0">
            إدارة جميع الوثائق التي تم انشائها
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
        {/* Filters toolbar */}
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              تصفية النتائج
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#1c46a2] transition">
                <RotateCcw size={14} />
                إعادة التعيين
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Autocomplete
              options={
                companies?.data.map((m) => ({ label: m.name, id: m.id })) || []
              }
              getOptionLabel={(option) => option.label}
              sx={{ width: "100%" }}
              onChange={(_e, value) =>
                setFilters((pre) => ({
                  ...pre,
                  companyId: value ? +value.id : undefined,
                  page: 1,
                }))
              }
              renderInput={(params) => (
                <TextField {...params} label="الشركة" size="small" fullWidth />
              )}
            />

            <Autocomplete
              options={
                plans?.results.map((m) => ({ label: m.name, id: m.id })) || []
              }
              getOptionLabel={(option) => option.label}
              sx={{ width: "100%" }}
              onChange={(_e, value) =>
                setFilters((pre) => ({
                  ...pre,
                  planId: value ? +value.id : undefined,
                  page: 1,
                }))
              }
              renderInput={(params) => (
                <TextField {...params} label="الباقه" size="small" fullWidth />
              )}
            />

            <Autocomplete
              options={INSURANCE_TYPES}
              getOptionLabel={(option) => option.label}
              sx={{ width: "100%" }}
              onChange={(_e, value) =>
                setFilters((pre) => ({
                  ...pre,
                  insuranceType: value
                    ? (value.value as InsuranceType)
                    : undefined,
                  page: 1,
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="نوع التأمين"
                  size="small"
                  fullWidth
                />
              )}
            />

            <Autocomplete
              options={CONFIRM_STATUS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_e, value) =>
                setFilters((pre) => ({
                  ...pre,
                  confirmed: value ? value.value : undefined,
                  page: 1,
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="حالة التأكيد"
                  size="small"
                  fullWidth
                />
              )}
            />

            {role === "ADMIN" && (
              <Select
                value={
                  partnerOptions.find(
                    (opt) => opt.value === filter.partnerId,
                  ) || null
                }
                className="basic-single text-gray-900"
                options={partnerOptions}
                isClearable
                placeholder="اختر المعرض..."
                onChange={(opt) =>
                  setFilters((f) => ({ ...f, partnerId: opt?.value, page: 1 }))
                }
              />
            )}
          </div>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="py-16">
            <Loading />
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileSearch size={48} strokeWidth={1.5} />
            <p className="mt-3 text-sm">لا توجد وثائق مطابقة</p>
          </div>
        ) : (
          <>
            <div className="w-full overflow-auto px-2">
              <table className="min-w-[1200px] w-full text-sm text-right border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white">
                    <th className="p-3 font-medium rounded-r-lg">#</th>
                    <th className="p-3 font-medium">اسم المستخدم</th>
                    <th className="p-3 font-medium">رقم الهاتف</th>
                    <th className="p-3 font-medium">الشركه</th>
                    <th className="p-3 font-medium">رقم الوثيقة</th>
                    <th className="p-3 font-medium">نوع التأمين</th>
                    <th className="p-3 font-medium">الحاله</th>
                    <th className="p-3 font-medium">تاريخ الاصدار</th>
                    <th className="p-3 font-medium">تاريخ الانتهاء</th>
                    <th className="p-3 font-medium rounded-l-lg">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <tr
                      key={document.id}
                      className="bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                      <td className="p-3 rounded-r-lg text-gray-400">
                        {document.id}
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        {document.user.name}
                      </td>
                      <td className="p-3">{document.user.phone}</td>
                      <td className="p-3">{document.company.name}</td>
                      <td className="p-3">
                        <DocumentNumberBadge number={document.documentNumber} />
                      </td>
                      <td className="p-3">{getInsuranceTypeLabel(document)}</td>
                      <td className="p-3">
                        <ConfirmBadge confirmed={document.confirmed} />
                      </td>
                      <td className="p-3">
                        <DateBadge date={document.startDate} tone="blue" />
                      </td>
                      <td className="p-3">
                        <DateBadge date={document.endDate} tone="purple" />
                      </td>
                      <td className="p-3 rounded-l-lg">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigation(`/documents/${document.id}`)
                            }
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                            <Eye size={14} /> التفاصيل
                          </button>

                          {role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => {
                                  setConfirmOpen(true);
                                  setId(document.id);
                                }}
                                disabled={document.confirmed}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                                  document.confirmed
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-green-50 text-green-700 hover:bg-green-100"
                                }`}>
                                <CheckCircle2 size={14} /> تأكيد
                              </button>

                              {/* Edit — always available to admin */}
                              <button
                                onClick={() =>
                                  navigation(`/documents/edit/${document.id}`)
                                }
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                                <Edit size={14} /> تعديل
                              </button>

                              {/* Delete — only when NOT confirmed */}
                              {!document.confirmed && (
                                <button
                                  onClick={() => {
                                    setDeleteId(document.id);
                                    setDeleteOpen(true);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition">
                                  <Trash2 size={14} /> حذف
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 pt-2 pb-5">
              <Pagination
                page={filter.page || 1}
                totalPages={data?.data.totalPages || 1}
                onPageChange={(page) => setFilters((pre) => ({ ...pre, page }))}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmDocumentModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSubmit={handleConfirm}
        loading={updateMutation.isPending}
      />

      <DeleteDialog
        isOpen={deleteOpen}
        title="حذف الوثيقة"
        message="هل أنت متأكد أنك تريد حذف هذه الوثيقة؟ لا يمكن التراجع عن هذا الإجراء."
        isLoading={deleteLoading}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={() => removeDocument()}
      />
    </div>
  );
}
