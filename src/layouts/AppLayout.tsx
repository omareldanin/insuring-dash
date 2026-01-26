import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type Props = {
  children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content */}
      <main
        className={`flex-1 w-full mt-20 p-6 transition-all duration-300 pb-8 ${
          isSidebarOpen ? "mr-70 lg:mr-70" : "mr-0 lg:mr-70"
        }`}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
