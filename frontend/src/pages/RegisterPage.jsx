import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, UserPlus, CheckSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { registerSchema } from "../utils/validationSchemas.js";
import { setCredentials } from "../store/slices/authSlice.js";
import { registerUser } from "../services/auth.service.js";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (formData) => {
    try {
      const response = await registerUser(formData);
      const { user, accessToken } = response.data;

      dispatch(setCredentials({ user, accessToken }));

      toast.success("Account created! Welcome 🎉");
      navigate("/tasks");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08)_0%,_transparent_60%)]">
      <div className="auth-card w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <CheckSquare size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            TaskFlow
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">Create your free account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="John Doe"
                autoFocus
                {...register("name")}
                className={`form-input pl-10 ${errors.name ? "error" : ""}`}
              />
            </div>
            {errors.name && (
              <span className="text-xs text-red-400">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`form-input pl-10 ${errors.email ? "error" : ""}`}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-400">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="password"
                placeholder="Min. 6 characters"
                {...register("password")}
                className={`form-input pl-10 ${errors.password ? "error" : ""}`}
              />
            </div>
            {errors.password && (
              <span className="text-xs text-red-400">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full mt-1 py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating
                account...
              </>
            ) : (
              <>
                <UserPlus size={16} /> Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
