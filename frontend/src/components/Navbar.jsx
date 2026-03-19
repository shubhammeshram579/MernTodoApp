import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, CheckSquare, User } from "lucide-react";
import toast from "react-hot-toast";

import { logout, selectUser } from "../store/slices/authSlice.js";
import { logoutUser } from "../services/auth.service.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
    } finally {
      // Always clear Redux state + localStorage
      dispatch(logout());
      toast.success("Logged out successfully.");
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-gray-100 tracking-tight">
            TaskFlow
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center">
              <User size={14} className="text-gray-400" />
            </div>
            <span className="hidden sm:block font-medium text-gray-300">
              {user?.name}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 border border-gray-800 hover:border-red-500/30 transition duration-200"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
