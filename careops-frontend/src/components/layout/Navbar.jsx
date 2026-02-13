import { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-100 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <Menu size={22} />
            </button>
          )}

          <NavLink
            to="/"
            className="flex items-center gap-2 group"
          >
            <img
              src="https://my-portfolio-wheat-zeta-89.vercel.app/Images/logo5.png"
              alt="CareOps"
              className="w-10"
            />
            <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition">
              CareOps
            </span>
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-md"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div
              className="relative"
              ref={dropdownRef}
            >
              <button
                onClick={() =>
                  setOpenDropdown(!openDropdown)
                }
                className="flex items-center gap-3 bg-slate-800 px-3 py-2 rounded-xl hover:bg-slate-700 transition"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </div>

                <span className="hidden md:block text-sm font-medium">
                  {user.name || user.email}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition ${
                    openDropdown
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-slate-500 border border-white rounded-xl shadow-xl py-2 animate-fadeIn">
                  {/* <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-950 hover:text-white transition"
                  >
                    <User size={16} />
                    Profile
                  </button> */}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-950 hover:text-red-600 transition rounded-2xl"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
