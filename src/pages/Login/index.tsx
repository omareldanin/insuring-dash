import { useState } from "react";
import { User, Lock } from "lucide-react"; // icons
import { signInService, type SignInRequest } from "../../services/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import { useAuth } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { DotSpinner } from "ldrs/react";
import loginbk from "../../assets/login.svg";
import loginLogo from "../../assets/loginLogo.png";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: ({ password, identifier }: SignInRequest) => {
      return signInService({ password, identifier, fcm: "test" });
    },
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["validateToken"],
      });
      setAuth(data);
      navigate("/home");
    },
    onError: (
      error: AxiosError<{
        message: string;
        status: string;
      }>,
    ) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const performLogin = () => {
      login({
        password: password,
        identifier: username,
        fcm: "test",
      });
    };

    performLogin();
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
      {/* Form */}
      <div className="w-full h-[100vh] md:w-[450px] bg-white shadow-lg p-8 text-center flex flex-col  items-center">
        <div>
          <img
            src={loginLogo}
            alt="Login"
            className="max-w-[250px] h-auto mb-10"
          />
        </div>
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#000] mb-4 mt-4">
            مرحبا بك لوحة التحكم!
          </h1>
          <p className="text-lg text-gray-500 mb-6">تسجيل الدخول</p>

          <form
            className="space-y-4 text-right"
            dir="rtl"
            onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block mb-2 text-gray-700">رقم الهاتف</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ادخل رقم الهاتف"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] focus:outline-none bg-[#F9FAFB]"
                />
                <User
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-gray-700">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="ادخل كلمة المرور"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] focus:outline-none bg-[#F9FAFB]"
                />
                <Lock
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1c46a2] to-[#31e5b7] text-white py-2 rounded-lg transition">
              {isLoading ? (
                <DotSpinner size="18" speed="0.9" color="#fff" />
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Image (Desktop only) */}
      <div className="hidden md:flex flex-1 justify-center items-center">
        <img src={loginbk} alt="Login" className="max-w-full h-auto" />
      </div>
    </div>
  );
};
export default Login;
