"use client";

import { useState } from "react";
import Loading from "../../components/loading";
import Pagination from "../../components/Pagintation";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import type { AxiosError } from "axios";
import type { APIError } from "../../api/api";
import DeleteDialog from "../../components/DeleteDialog";
import { useCompanies } from "../../hooks/useCompanies";
import {
  companyOptions,
  deleteCompany,
  type GetCompanyParams,
} from "../../services/companies";
import Select from "react-select";

export default function Companies() {
  const navigation = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  const [filters, setFilters] = useState<GetCompanyParams>({
    page: 1,
    size: 10,
  });

  const { data, isLoading } = useCompanies(filters);

  const { mutate: deleteCompanyById, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteCompany(id),
    onSuccess: () => {
      toast.success("تم حذف الشركه بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["cars"],
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
            إدارة الشركات
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            إدارة جميع الشركات المتوفرة في النظام
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => navigation("/companies/add")}>
          + إضافة شركه
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl pt-4 pb-10">
        {/* Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5  p-3">
          <div>
            <input
              type="text"
              placeholder="بحث بالاسم .."
              className="w-full px-4 py-[6px] border border-[#E0E0E0] rounded-md focus:ring-2 focus:ring-[#fff] focus:outline-[none] bg-[#fff] text-gray-900 placeholder-gray-400"
              value={filters.search}
              onChange={(e) =>
                setFilters((pre) => ({ ...pre, search: e.target.value }))
              }
            />
          </div>
          <div>
            <Select
              value={companyOptions?.find(
                (o) => o.value === filters.companyType,
              )}
              options={companyOptions}
              isClearable
              className="basic-single  text-gray-900 "
              placeholder="اختر نوع الشركه..."
              onChange={(opt) =>
                setFilters((f) => ({
                  ...f,
                  companyType: opt ? opt.value : undefined,
                }))
              }
            />
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <table className="w-full text-sm text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white shadow-sm">
                  <th className="p-2">#</th>
                  <th className="p-2">اسم الشركه</th>
                  <th className="p-2">البريد الالكتروني</th>
                  <th className="p-2">نوع الشركه</th>
                  <th className="p-2">انواع التأمين</th>
                  <th className="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.data.map((company) => {
                  return (
                    <tr
                      key={company.id}
                      className="bg-white rounded-lg text-gray-700 border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 border-b border-gray-200">
                        {company.id}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {company.name}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {company.email}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {company.companyType === "COMMERCIAL"
                          ? "تجاري"
                          : "تكافلي"}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {company.insuranceTypes.toLocaleString()}
                      </td>

                      <td className="p-3 border-b border-gray-200">
                        <div className="flex gap-2">
                          <button
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                            onClick={() => navigation("/companies/filters")}>
                            الفلاتر
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setIsDialogOpen(true);
                              setId(company.id);
                            }}>
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              navigation(`/companies/edit/${company.id}`);
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
            {data?.meta.total === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد شركات</p>
              </div>
            ) : null}
            <Pagination
              page={filters.page || 1}
              totalPages={data?.meta.pages || 1}
              onPageChange={(page) => {
                setFilters((pre) => ({ ...pre, page }));
              }}
            />
          </>
        )}
      </div>
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف الشركه"
        message="هل أنت متأكد أنك تريد حذف هذه الشركه؟"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteCompanyById();
        }}
      />
    </div>
  );
}
