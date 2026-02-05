import { NavLink } from "react-router-dom";
import { Home, X, Users, Building, Layers, Car } from "lucide-react";
import logo from "../assets/logo-l.png";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay (sidebar) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-70 bg-[#21114A] text-white h-screen p-4 flex flex-col pt-2 z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}>
        {/* Close button on mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 lg:hidden text-white">
          <X size={28} />
        </button>

        {/* Logo */}
        <div className="flex mb-3 pb-1 justify-center">
          <img src={logo} alt="" />
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-3">
          {[
            {
              to: "/home",
              icon: <Home size={20} />,
              label: "الرئيسيه",
              roles: ["ADMIN"],
            },
            {
              to: "/users",
              icon: <Users size={20} />,
              label: "المستخدمين",
              roles: ["ADMIN"],
            },
            {
              to: "/companies",
              icon: <Building size={20} />,
              label: "الشركات",
              roles: ["ADMIN"],
            },
            {
              to: "/plans",
              icon: <Layers size={20} />,
              label: "باقات التأمين",
              roles: ["ADMIN"],
            },
            {
              to: "/cars",
              icon: <Car size={20} />,
              label: "السيارات",
              roles: ["ADMIN"],
            },
          ]
            // .filter((l) => l.roles.includes(role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to!}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-[7px] transition ${
                    isActive
                      ? "bg-gradient-to-l from-[#1c46a2] to-[#31e5b7]  text-[#404040]"
                      : "hover:bg-gray-700 text-white"
                  }`
                }>
                <span className="bg-white p-[5px] rounded-[7px] text-[#121E2C]">
                  {item.icon}
                </span>
                <span className="font-bold text-[14px] text-[#fff]">
                  {item.label}
                </span>
              </NavLink>
            ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
