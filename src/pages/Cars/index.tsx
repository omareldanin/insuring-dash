"use client";

import { useState } from "react";
import { useCars, useMakes, useModels } from "../../hooks/useCars";
import Loading from "../../components/loading";
import Pagination from "../../components/Pagintation";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteCar } from "../../services/cars";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import type { AxiosError } from "axios";
import type { APIError } from "../../api/api";
import DeleteDialog from "../../components/DeleteDialog";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function Cars() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [page, setPage] = useState(1);
  const navigation = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);
  const size = 10;

  const { data, isLoading } = useCars({
    make: make || undefined,
    model: model || undefined,
    page,
    size,
  });

  const { mutate: deleteCarById, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteCar(id),
    onSuccess: () => {
      toast.success("تم حذف السياره بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["cars"],
      });
      setIsDialogOpen(false);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const { data: makes } = useMakes();
  const { data: carModels } = useModels(+make);

  return (
    <div className="relative pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            إدارة السيارات
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            إدارة جميع السيارات المتوفرة في الشركه
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => navigation("/cars/add")}>
          + إضافة سياره
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl pt-4 pb-10">
        {/* Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5  p-3">
          <div>
            <Autocomplete
              options={makes?.map((m) => ({ label: m.name, id: m.id })) || []}
              getOptionLabel={(option) => option.label}
              sx={{
                width: "100%",
              }}
              onChange={(_event, value) => {
                if (!value) {
                  setMake("");
                } else {
                  setMake(value.id + "");
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
                carModels?.map((m) => ({ label: m.name, id: m.id })) || []
              }
              getOptionLabel={(option) => option.label}
              sx={{
                width: "100%",
              }}
              onChange={(_event, value) => {
                if (!value) {
                  setModel("");
                } else {
                  setModel(value.id + "");
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="الموديل" fullWidth />
              )}
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
                  <th className="p-2">الماركه</th>
                  <th className="p-2">الموديل</th>
                  <th className="p-2">سنة الاصدار</th>
                  <th className="p-2">سعر السياره</th>
                  <th className="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.data.data.map((car) => {
                  return (
                    <tr
                      key={car.id}
                      className="bg-white rounded-lg text-gray-700 border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 border-b border-gray-200">{car.id}</td>
                      <td className="p-3 border-b border-gray-200">
                        {car.model.make.name}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {car.model.name}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {car.year}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {car.minimumPrice?.toLocaleString()}
                      </td>

                      <td className="p-3 border-b border-gray-200">
                        <div className="flex gap-2">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setIsDialogOpen(true);
                              setId(car.id);
                            }}>
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              navigation(`/cars/edit/${car.id}`);
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
            {data?.data.meta.total === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد سيارات</p>
              </div>
            ) : null}
            <Pagination
              page={page || 1}
              totalPages={data?.data.meta.pages || 1}
              onPageChange={(page) => {
                setPage(page);
              }}
            />
          </>
        )}
      </div>
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف السياره"
        message="هل أنت متأكد أنك تريد حذف هذه السياره؟"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteCarById();
        }}
      />
    </div>
  );
}
