import { Menu } from "lucide-react";
import admin from "../assets/user.png";
import { useAuth } from "../store/authStore";
import { baseURL } from "../api/api";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { name, avatar, logout } = useAuth();
  // const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 lg:right-65 bg-white shadow-sm px-6 py-3 flex items-center justify-between z-40">
      {/* Left: Toggle button (mobile only) */}
      <div className="flex gap-2">
        <button
          className="lg:hidden text-gray-800"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar">
          <Menu size={26} />
        </button>

        <div className="flex items-center gap-3 ms-auto">
          <img
            src={avatar ? baseURL + avatar : admin}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-right">
            <p className="font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{"مدير النظام"}</p>
          </div>
        </div>
      </div>

      {/* Left: Icons */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          {/* <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2">
            <Bell size={22} className="text-gray-800" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button> */}
        </div>

        {/* Settings */}
        <button
          className="p-2"
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}>
          <span className="text-[red]">تسجيل خروج</span>
        </button>

        {/* {showSettings && (
          <div className="absolute left-10 top-20 w-40 bg-white border rounded-lg shadow-lg text-right">
            <span onClick={logout}> تسجيل خروج</span>
            <ul className="max-h-60 overflow-y-auto">
              <li
                className="p-3 hover:bg-gray-50 cursor-pointer text-sm text-[red]"
                onClick={logout}>
                تسجيل خروج
              </li>
            </ul> 
          </div>
        )} */}
      </div>
    </header>
  );
}
