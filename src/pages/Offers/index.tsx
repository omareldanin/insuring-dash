"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Loading from "../../components/loading";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import type { AxiosError } from "axios";
import type { APIError } from "../../api/api";
import DeleteDialog from "../../components/DeleteDialog";
import {
  createOffer,
  deleteOffer,
  updateOffer,
  type Offer,
} from "../../services/offers";
import { useOffers } from "../../hooks/userOffers";
import OfferFormDialog from "./CreateOrUpdate";

export default function Offers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const { data, isLoading } = useOffers({ page: 1, size: 20 });

  const { mutate: deleteOfferById, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteOffer(id),
    onSuccess: () => {
      toast.success("تم حذف العرض بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["offers"],
      });
      setIsDialogOpen(false);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const createMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      toast.success("تم إضافة العرض");
      queryClient.invalidateQueries({
        queryKey: ["offers"],
      });
      setOpenCreate(false);
    },
    onError: () => {
      toast.error("حدث خطأ");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateOffer(id, data),
    onSuccess: () => {
      toast.success("تم تحديث العرض");
      queryClient.invalidateQueries({
        queryKey: ["offers"],
      });
      setEditingOffer(null);
    },
    onError: () => {
      toast.error("حدث خطأ");
    },
  });

  return (
    <div className="relative pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            إدارة العروض
          </h1>
        </div>
        <button
          className="bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => setOpenCreate(true)}>
          + إضافة عرض
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
                  <th className="p-2">قيمه الخصم</th>
                  <th className="p-2">نوع التأمين</th>
                  <th className="p-2">تاريخ الانشاء</th>
                  <th className="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.data?.data.map((offer) => {
                  const create = new Date(offer.createdAt);

                  return (
                    <tr
                      key={offer.id}
                      className="bg-white rounded-lg text-gray-700 border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 border-b border-gray-200">
                        {offer.id}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {offer.discount} %
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {offer.insuranceTypes.map((type) => {
                          return (
                            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-800 ml-2">
                              {type === "LIFE"
                                ? "حياه"
                                : type === "CAR"
                                  ? "سيارات"
                                  : "صحي"}
                            </button>
                          );
                        })}
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
                              setId(offer.id);
                            }}>
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              setEditingOffer(offer);
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
            {data?.data.data.length === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد عروض</p>
              </div>
            ) : null}
          </>
        )}
      </div>
      <OfferFormDialog
        open={openCreate}
        loading={createMutation.isPending}
        onClose={() => setOpenCreate(false)}
        onSubmit={(data) => createMutation.mutate(data)}
      />
      <OfferFormDialog
        open={!!editingOffer}
        loading={updateMutation.isPending}
        initialData={editingOffer || undefined}
        onClose={() => setEditingOffer(null)}
        onSubmit={(data) => {
          if (editingOffer) {
            updateMutation.mutate({
              id: editingOffer.id,
              data,
            });
          }
        }}
      />
      ;
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف العرض"
        message="هل أنت متأكد أنك تريد حذف هذا العرض"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteOfferById();
        }}
      />
    </div>
  );
}
