import { useContext, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Boxes,
  BarChart3,
  Home,
  Menu,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  if (!user) return null;

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Auto close on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const navItems = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/leads", icon: <Users size={20} />, label: "Leads" },
    { to: "/bookings", icon: <Calendar size={20} />, label: "Bookings" },
    { to: "/messages", icon: <MessageSquare size={20} />, label: "Messages" },
    { to: "/inventory", icon: <Boxes size={20} />, label: "Inventory" },
    { to: "/reports", icon: <BarChart3 size={20} />, label: "Reports" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-[60] bg-indigo-600 p-2 rounded-xl text-white shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed top-0 left-0 h-screen z-[55]
          bg-slate-900 border-r border-slate-800
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isHovered ? "md:w-64" : "md:w-20"}
          w-64
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
          <h2
            className={`text-lg font-bold text-white transition-all duration-300 ${
              isHovered || isOpen ? "opacity-100" : "opacity-0 md:opacity-0"
            }`}
          >
            CareOps
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-3 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              isHovered={isHovered}
              isOpen={isOpen}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

const NavItem = ({ to, icon, label, isHovered, isOpen }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500"
            : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`
      }
    >
      <div className="flex items-center justify-center w-6">{icon}</div>

      {/* Label */}
      <span
        className={`whitespace-nowrap transition-all duration-300 ${
          isHovered || isOpen
            ? "opacity-100 ml-2"
            : "opacity-0 w-0 ml-0"
        }`}
      >
        {label}
      </span>

      {/* Tooltip (only when collapsed on desktop) */}
      {!isHovered && !isOpen && (
        <span className="absolute left-16 bg-slate-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
          {label}
        </span>
      )}
    </NavLink>
  );
};

export default Sidebar;
