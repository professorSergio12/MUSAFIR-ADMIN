import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useAdminSignin } from "../../hooks/useAuth";

interface FormData {
  adminId: string;
  password: string;
}

interface ApiErrorBody {
  message?: string;
}

const initialForm: FormData = {
  adminId: "admin123",
  password: "root@123",
};

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: signin, isPending, error } = useAdminSignin();
  const [formData, setFormData] = useState<FormData>(initialForm);

  const userAppBase = import.meta.env.VITE_MUSAFIR_USER_URL as
    | string
    | undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { adminId, password } = formData;

    if (!adminId.trim() || !password) {
      alert("Please fill in all fields");
      return;
    }

    signin(
      { adminId: adminId.trim(), password },
      {
        onSuccess: (data) => {
          if (data.role === "admin") {
            navigate("/dashboard", { replace: true });
          } else {
            alert("Access denied.");
          }
        },
        onError: (err: unknown) => {
          console.error("Signin error:", err);
          const ax = err as AxiosError<ApiErrorBody>;
          alert(ax.response?.data?.message ?? "Something went wrong!");
        },
      },
    );
  };

  const errorMessage =
    error &&
    (error as AxiosError<ApiErrorBody>).response?.data?.message !== undefined
      ? (error as AxiosError<ApiErrorBody>).response?.data?.message
      : error
        ? "Something went wrong!"
        : null;

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-slate-950 lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <div className="relative flex w-full min-h-[min(42vh,380px)] shrink-0 flex-col justify-center overflow-hidden lg:h-full lg:min-h-0 lg:w-1/2 lg:flex-1">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpu6rveug/image/upload/v1763201820/singin-img_x3ddcp.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/45 to-blue-950/75" />

        <div className="relative z-10 flex min-h-[inherit] flex-col justify-center px-6 py-12 text-white sm:px-10 sm:py-16 lg:min-h-[100dvh] lg:px-12 lg:py-0">
          <div>
            <h1
              className="mb-2 text-center text-xl font-bold sm:mb-3 md:mb-4 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
              style={{ fontFamily: "cursive" }}
            >
              MUSAFIR
            </h1>
            <p className="mx-auto max-w-md px-2 text-center text-xs leading-relaxed text-white/90 sm:text-sm md:text-base lg:text-lg xl:text-xl">
              Travel is the only purchase that enriches you in ways beyond
              material wealth.
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-1 flex-col justify-center bg-white px-6 py-10 dark:bg-gray-900 sm:px-10 sm:py-14 lg:h-full lg:min-h-0 lg:w-1/2 lg:overflow-y-auto lg:px-12 lg:py-10">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 hidden lg:block">
          <svg
            className="w-8 h-8 md:w-12 md:h-12 text-blue-500 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>

        <div className="w-full max-w-md">
          <h2 className="mb-1 text-xl font-bold text-blue-600 sm:text-2xl md:text-3xl lg:text-4xl dark:text-blue-400 sm:mb-2">
            Admin portal
          </h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400 sm:mb-6 md:mb-8 sm:text-sm md:text-base">
            Sign in with your admin ID and password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300 sm:mb-2 sm:text-sm">
                Admin ID
              </label>
              <input
                type="text"
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                placeholder="admin123"
                autoComplete="username"
                className="w-full rounded-lg border-2 border-blue-500 bg-white px-3 py-2.5 text-sm text-gray-900 transition focus:ring-2 focus:ring-blue-500 dark:border-blue-400 dark:bg-gray-700 dark:text-white sm:py-3 sm:text-base"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300 sm:mb-2 sm:text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-lg border-2 border-blue-500 bg-white px-3 py-2.5 text-sm text-gray-900 transition focus:ring-2 focus:ring-blue-500 dark:border-blue-400 dark:bg-gray-700 dark:text-white sm:py-3 sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full cursor-pointer rounded-lg py-2.5 px-4 text-sm font-semibold text-white transition duration-200 sm:py-3 sm:text-base ${
                isPending
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>

            {errorMessage && (
              <p className="text-center text-sm text-red-500">{errorMessage}</p>
            )}
          </form>

          {userAppBase ? (
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
              <a
                href={userAppBase.replace(/\/$/, "")}
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Open customer site
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
