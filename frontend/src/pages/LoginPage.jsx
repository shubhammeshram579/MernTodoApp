import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn, CheckSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { loginSchema } from "../utils/validationSchemas.js";
import { setCredentials } from "../store/slices/authSlice.js";
import { loginUser } from "../services/auth.service.js";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formData) => {
    try {
      const response = await loginUser(formData);
      const { user, accessToken } = response.data;

      dispatch(setCredentials({ user, accessToken }));

      toast.success(`Welcome back, ${user.name}!`);
      navigate("/tasks");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials. Try again.",
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
        <p className="text-sm text-gray-500 mb-8">Sign in to your workspace</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                autoFocus
                {...register("email")} 
                className={`form-input pl-10 ${errors.email ? "error" : ""}`}
              />
            </div>
            {/* Zod error message shown below the input */}
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
                placeholder="Your password"
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

          {/* Submit Button — isSubmitting from RHF auto handles the loading state */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full mt-1 py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Signing in...
              </>
            ) : (
              <>
                <LogIn size={16} /> Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
