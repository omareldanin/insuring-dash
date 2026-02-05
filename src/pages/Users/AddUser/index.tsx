"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../../main";
import type { AxiosError } from "axios";
import type { APIError } from "../../../api/api";
import { createUser } from "../../../services/users";

// ✅ Validation Schema (matches DTO + confirmPassword for frontend check)
const schema = yup.object({
  phone: yup
    .string()
    .matches(/^01[0-9]{9}$/, "رقم الهاتف غير صالح")
    .required("رقم الهاتف مطلوب"),

  name: yup.string().required("الاسم مطلوب"),

  email: yup
    .string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),

  gender: yup
    .mixed<"male" | "female">()
    .oneOf(["male", "female"], "النوع غير صالح")
    .required("النوع مطلوب"),

  role: yup
    .mixed<"ADMIN" | "PARTNER" | "CLIENT">()
    .oneOf(["ADMIN", "PARTNER", "CLIENT"], "النوع غير صالح")
    .required("النوع مطلوب"),

  birthDate: yup.string().required("تاريخ الميلاد مطلوب"),

  password: yup
    .string()
    .min(8, "كلمة المرور لا تقل عن 8 حروف")
    .required("كلمة المرور مطلوبة"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),

  avatar: yup.mixed().optional(),
});

export default function AddUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: "",
      name: "",
      email: "",
      gender: "male",
      role: "CLIENT",
      birthDate: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });

  const { mutate: createNewUser, isPending } = useMutation({
    mutationFn: (data: FormData) => createUser(data),
    onSuccess: () => {
      toast.success("تم اضافة المستخدم بنجاح", {
        duration: 4000,
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      reset(); // ✅ Clear form after success
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما", {
        duration: 4000,
      });
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();

    formData.append("phone", data.phone);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("gender", data.gender);
    formData.append("role", data.role);
    formData.append("birthDate", data.birthDate);
    formData.append("password", data.password);

    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    createNewUser(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">
        إضافة مستخدم جديد
      </h1>
      <button onClick={() => toast.success("Test Toast")}>Test</button>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* الصورة */}
        <div>
          <label className="block mb-1 text-[#121E2C]">صورة اليوزر</label>
          <input
            type="file"
            {...register("avatar")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.avatar?.message as string}
          </p>
        </div>

        {/* الاسم */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            اسم المستخدم
            <span className="text-[red]">*</span>
          </label>
          <input
            {...register("name")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.name?.message as string}
          </p>
        </div>

        {/* رقم الهاتف */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            رقم الهاتف <span className="text-[red]">*</span>
          </label>
          <input
            {...register("phone")}
            maxLength={11}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.phone?.message as string}
          </p>
        </div>
        <div>
          <label className="block mb-1 text-[#121E2C]">
            البريد الالكتروني <span className="text-[red]">*</span>
          </label>
          <input
            {...register("email")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="error">{errors.email?.message as string}</p>
        </div>
        <div>
          <label className="block mb-1 text-[#121E2C]">
            النوع <span className="text-[red]">*</span>
          </label>
          <select
            {...register("gender")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900">
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
          <p className="error">{errors.gender?.message as string}</p>
        </div>

        <div>
          <label className="block mb-1 text-[#121E2C]">
            نوع المستخدم <span className="text-[red]">*</span>
          </label>{" "}
          <select
            {...register("role")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900">
            <option value="ADMIN">مشرف</option>
            <option value="CLIENT">عميل</option>
            <option value="PARTNER">شريك نجاح</option>
          </select>
          <p className="error">{errors.role?.message as string}</p>
        </div>

        <div>
          <label className="block mb-1">تاريخ الميلاد *</label>
          <input
            type="date"
            {...register("birthDate")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="error">{errors.birthDate?.message as string}</p>
        </div>

        {/* كلمة المرور */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            كلمة المرور <span className="text-[red]">*</span>
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.password?.message as string}
          </p>
        </div>

        {/* تأكيد كلمة المرور */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            تأكيد كلمة المرور <span className="text-[red]">*</span>
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.confirmPassword?.message as string}
          </p>
        </div>

        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-[#121E2C] text-white font-medium rounded-lg hover:bg-[#2C2C2C] transition disabled:opacity-50">
          {isPending ? "جارٍ الإضافة..." : "حفظ"}
        </button>
      </form>
    </div>
  );
}
