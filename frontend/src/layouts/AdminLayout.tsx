import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-row flex-1 pt-[73px]">
        <Sidebar />
        <main className="flex-1 bg-gray-100 overflow-auto ml-64">
          <Outlet /> {/* 👈 routes render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
