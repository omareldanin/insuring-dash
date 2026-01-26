"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Pagination from "../components/Pagintation";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "../components/DeleteDialog";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import { baseURL, type APIError } from "../api/api";
import { useUsers } from "../hooks/useUsers";
import {
  deleteUser,
  usersOptions,
  type GetUsersParams,
} from "../services/users";
import Loading from "../components/loading";
import userImage from "../assets/user.png";
import Select from "react-select";

export default function Users() {
  const navigation = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  const [filters, setFilters] = useState<GetUsersParams>({
    page: 1,
    size: 10,
  });

  const { data, isLoading } = useUsers(filters);

  const { mutate: deleteUserById, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      toast.success("تم حذف المستخدم بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setIsDialogOpen(false);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
  const getAge = (birthDate: Date): number => {
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // لو لسه عيد ميلاده ما جاش السنة دي
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };
  return (
    <div className="relative pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            إدارة المستخدمين
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            إدارة جميع المستخدمين المتوفرة في الشركه
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => navigation("/users/add")}>
          + إضافة مستخدم جديد
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
              value={filters.name}
              onChange={(e) =>
                setFilters((pre) => ({ ...pre, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Select
              value={usersOptions?.find((o) => o.value === filters.role)}
              options={usersOptions}
              isClearable
              className="basic-single  text-gray-900 "
              placeholder="اختر نوع المستخدم..."
              onChange={(opt) =>
                setFilters((f) => ({
                  ...f,
                  role: opt ? opt.value : undefined,
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
                  <th className="p-2">الاسم</th>
                  <th className="p-2">رقم الهاتف</th>
                  <th className="p-2">البريد الالكتروني</th>
                  <th className="p-2">السن</th>
                  <th className="p-2">تاريخ الانشاء</th>
                  <th className="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.results.map((vendor) => {
                  const create = new Date(vendor.createdAt);
                  const birthDate = new Date(vendor.birthDate);

                  return (
                    <tr
                      key={vendor.id}
                      className="bg-white rounded-lg text-gray-700 border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 border-b border-gray-200">
                        {vendor.id}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              vendor.avatar
                                ? baseURL + vendor.avatar
                                : userImage
                            }
                            alt={vendor.name}
                            className="w-[40px] h-[40px] rounded-full object-cover"
                          />
                          <span className="text-gray-800 font-medium">
                            {vendor.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {vendor.phone}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {vendor.email}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {getAge(birthDate)} سنه
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
                              setId(vendor.id);
                            }}>
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              navigation(`/users/edit/${vendor.id}`);
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
            {data?.count === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد مستخدمين</p>
              </div>
            ) : null}
            <Pagination
              page={filters.page || 1}
              totalPages={data?.totalPages || 1}
              onPageChange={(page) => {
                setFilters((pre) => ({ ...pre, page }));
              }}
            />
          </>
        )}
      </div>
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف المستخدم"
        message="هل أنت متأكد أنك تريد حذف هذا المستخدم"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteUserById();
        }}
      />
    </div>
  );
}
