import { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthContext } from "../../context/AuthContext";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      {user && (
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="flex flex-col min-h-screen">

        {/* Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content */}
        <main className="flex-1 pt-20 px-4 ml-5 md:ml-20 md:px-8 lg:px-10 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
