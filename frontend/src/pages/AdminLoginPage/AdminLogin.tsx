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

/** Same hero asset as `MUSAFIR-Exommerce/frontend/src/pages/SignIn.jsx`. */
const LOGIN_HERO_IMAGE =
  "https://res.cloudinary.com/dpu6rveug/image/upload/v1763201820/singin-img_x3ddcp.jpg";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: signin, isPending, error } = useAdminSignin();
  const [formData, setFormData] = useState<FormData>(initialForm);

  const userAppBase = (
    import.meta.env.VITE_MUSAFIR_USER_URL as string | undefined
  )?.trim();

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

  const storeHref = userAppBase?.replace(/\/$/, "") ?? "";

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-3 py-4 sm:px-4 sm:py-8 md:py-12 lg:py-16">
      <div className="flex min-h-[calc(100vh-200px)] w-full max-w-7xl flex-col overflow-hidden rounded-lg shadow-2xl sm:rounded-xl md:rounded-2xl lg:flex-row">
        {/* Left — same image layer as SignIn (bg-cover + URL only; no gradient, no filter, no blur) */}
        <div className="relative w-full overflow-hidden rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[calc(100vh-200px)] lg:w-1/2 lg:rounded-l-2xl lg:rounded-tr-none">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${LOGIN_HERO_IMAGE}')`,
            }}
            aria-hidden
          />

          <div className="relative z-10 flex h-full flex-col justify-center p-4 text-white sm:p-6 md:p-8 lg:p-12">
            <div>
              <h1
                className="mb-2 text-center text-xl font-bold sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl lg:text-4xl xl:text-5xl"
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

        {/* Right — same shell + form styles as SignIn.jsx (no OAuth / OR) */}
        <div className="relative flex min-h-[calc(100vh-200px)] w-full items-center justify-center rounded-b-lg bg-white p-4 sm:rounded-b-xl sm:p-6 md:rounded-b-2xl md:p-8 lg:w-1/2 lg:rounded-r-2xl lg:rounded-bl-none lg:p-12 dark:bg-gray-800">
          <div className="absolute right-4 top-4 hidden md:right-8 md:top-8 lg:block">
            <svg
              className="h-8 w-8 text-blue-500 md:h-12 md:w-12 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
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
            <h2 className="mb-1 text-xl font-bold text-blue-600 sm:mb-2 sm:text-2xl md:text-3xl lg:text-4xl dark:text-blue-400">
              Welcome
            </h2>
            <p className="mb-4 text-xs text-gray-500 sm:mb-6 sm:text-sm md:mb-8 md:text-base dark:text-gray-400">
              Login with Admin ID
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="admin-adminId"
                  className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm dark:text-gray-300"
                >
                  Admin ID
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:left-3 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    id="admin-adminId"
                    type="text"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleChange}
                    placeholder="admin123"
                    autoComplete="username"
                    className="w-full rounded-lg border-2 border-blue-500 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 transition focus:ring-2 focus:ring-blue-500 sm:py-3 sm:pl-10 sm:pr-4 sm:text-base dark:border-blue-400 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:left-3 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    id="admin-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border-2 border-blue-500 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 transition focus:ring-2 focus:ring-blue-500 sm:py-3 sm:pl-10 sm:pr-4 sm:text-base dark:border-blue-400 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Forgot your password?
                </span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={`w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition duration-200 sm:py-3 sm:text-base ${
                  isPending
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPending ? "Logging in..." : "LOGIN"}
              </button>

              {errorMessage ? (
                <p className="text-center text-sm text-red-500">{errorMessage}</p>
              ) : null}

              {storeHref ? (
                <p className="mt-6 border-t border-gray-300 pt-6 text-center text-sm text-gray-600 dark:border-gray-600 dark:text-gray-300">
                  <a
                    href={storeHref}
                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Back to Musafir store
                  </a>
                </p>
              ) : null}

              <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                Admin access only. Customer sign-in is on the storefront.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
