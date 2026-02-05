import MonthlyOrdersChart from "../../components/ChartComponent";
import ProductOrdersChart from "../../components/ProductOrdersChart";
import { Wallet, Users, Store, Building } from "lucide-react";

const mockData = {
  statusCounts: {
    STARTED: 42,
    ACCEPTED: 120,
  },

  monthlySales: {
    "2025-01": {
      total: 32000,
      shipping: 4500,
    },
    "2025-02": {
      total: 41000,
      shipping: 5200,
    },
    "2025-03": {
      total: 38000,
      shipping: 4900,
    },
    "2025-04": {
      total: 47000,
      shipping: 6100,
    },
    "2025-05": {
      total: 53000,
      shipping: 6800,
    },
  },
};

const Home = () => {
  // if (isLoading) {
  //   return <Loading />;
  // }

  const stats = [
    {
      title: "المستخدمين",
      value: 22,
      icon: <Users size={28} />,
      color: "bg-[#31e6b73b]",
      textColor: "text-[#403D39]",
    },
    {
      title: "شركاء النجاح",
      value: 30,
      icon: <Store size={28} />,
      color: "bg-[#31e6b787]",
      textColor: "text-[#403D39]",
    },
    {
      title: "الشركات",
      value: 40,
      icon: <Building size={28} />,
      color: "bg-[#31e6b7d1]",
      textColor: "text-[#403D39]",
    },
    {
      title: "الوِثائق",
      value: 150,
      icon: <Wallet size={28} />,
      color: "bg-[#31e6b7ff]",
      textColor: "text-[#403D39]",
    },
  ];

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex item-center justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#21114A] mb-1">
            لوحه التحكم الرئيسيه
          </h1>
          <p className="text-sm text-gray-500">نظرة عامة على أداء الشركه</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-md p-5 flex items-center justify-between transition hover:scale-[1.02] duration-300 ${stat.color}`}>
            <div>
              <p className={`text-sm font-medium opacity-90 ${stat.textColor}`}>
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
      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="bg-white shadow rounded-2xl p-4">
          <ProductOrdersChart ordersByStatus={mockData.statusCounts} />
        </div>

        <div className="bg-white shadow rounded-2xl p-4 col-span-2">
          <h2 className="font-bold text-lg mb-4 text-right text-[#121E2C]">
            أداء المبيعات الشهريه
          </h2>

          <div className="space-y-4">
            <MonthlyOrdersChart monthlySales={mockData.monthlySales} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
