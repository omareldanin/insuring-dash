import ProductOrdersChart from "../../components/ProductOrdersChart";
import { Wallet, Users, Store, Building } from "lucide-react";
import { useStatistics } from "../../hooks/useCompanies";
import Loading from "../../components/loading";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../store/authStore";

const Home = () => {
  const { data, isLoading } = useStatistics();
  const { role } = useAuth();
  const stats = [
    {
      title: "المستخدمين",
      value: data?.totalUsers,
      icon: <Users size={28} />,
      color: "bg-[#31e6b73b]",
      textColor: "text-[#403D39]",
    },
    {
      title: "شركاء النجاح",
      value: data?.totalPartners,
      icon: <Store size={28} />,
      color: "bg-[#31e6b787]",
      textColor: "text-[#403D39]",
    },
    {
      title: "الشركات",
      value: data?.totalCompanies,
      icon: <Building size={28} />,
      color: "bg-[#31e6b7d1]",
      textColor: "text-[#403D39]",
    },
    {
      title: "الوِثائق",
      value: data?.totalDocuments,
      icon: <Wallet size={28} />,
      color: "bg-[#31e6b7ff]",
      textColor: "text-[#403D39]",
    },
  ];

  const partnerStats = [
    {
      title: "المستخدمين",
      value: data?.totalUsers,
      icon: <Users size={28} />,
      color: "bg-[#31e6b73b]",
      textColor: "text-[#403D39]",
    },
    {
      title: "البائعين",
      value: data?.totalPartners,
      icon: <Store size={28} />,
      color: "bg-[#31e6b787]",
      textColor: "text-[#403D39]",
    },

    {
      title: "الوِثائق",
      value: data?.totalDocuments,
      icon: <Wallet size={28} />,
      color: "bg-[#31e6b7ff]",
      textColor: "text-[#403D39]",
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex item-center justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#21114A] mb-1">
            لوحه التحكم الرئيسيه
          </h1>
          {role === "ADMIN" ? (
            <p className="text-sm text-gray-500">نظرة عامة على أداء الشركه</p>
          ) : (
            <p className="text-sm text-gray-500">نظرة عامة على أداء المعرض</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className={
          role === "ADMIN"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        }>
        {role === "ADMIN"
          ? stats.map((stat, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow-md p-5 flex items-center justify-between transition hover:scale-[1.02] duration-300 ${stat.color}`}>
                <div>
                  <p
                    className={`text-sm font-medium opacity-90 ${stat.textColor}`}>
                    {stat.title}
                  </p>
                  <h2 className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </h2>
                </div>
                <div
                  className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner ${stat.textColor}`}>
                  {stat.icon}
                </div>
              </div>
            ))
          : partnerStats.map((stat, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow-md p-5 flex items-center justify-between transition hover:scale-[1.02] duration-300 ${stat.color}`}>
                <div>
                  <p
                    className={`text-sm font-medium opacity-90 ${stat.textColor}`}>
                    {stat.title}
                  </p>
                  <h2 className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </h2>
                </div>
                <div
                  className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner ${stat.textColor}`}>
                  {stat.icon}
                </div>
              </div>
            ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-5">
        <div className="bg-white shadow rounded-2xl p-4">
          <ProductOrdersChart
            ordersByStatus={{
              STARTED: data?.totalNotConfirmed || 0,
              ACCEPTED: data?.totalConfirmed || 0,
            }}
          />
        </div>

        <div className="bg-white shadow rounded-2xl p-4 col-span-2">
          <h2 className="font-bold text-lg mb-4 text-right text-[#121E2C]">
            {role === "ADMIN" ? "أداء المبيعات للشركات" : "أداء البائعين"}
          </h2>

          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                data={data?.companiesChart}>
                <XAxis
                  dataKey="companyName"
                  fontSize={12}
                  fontWeight={"bold"}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="documents" name={"الوثائق"} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
