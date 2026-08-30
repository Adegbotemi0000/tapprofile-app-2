"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignIn() {
  const [darkMode, setDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#090909] text-white"
          : "bg-[#f7f7f7] text-[#111]"
      }`}
    >

      {/* Header */}
      <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">

        <Link
          href="/"
          className="text-xl font-semibold tracking-[0.25em]"
        >
          TAP PROFILE
        </Link>


        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`rounded-full px-4 py-2 text-xs border transition ${
            darkMode
              ? "border-[#333] text-gray-300"
              : "border-gray-300 text-gray-700"
          }`}
        >
          {darkMode ? "Light" : "Dark"}
        </button>

      </nav>



      {/* Content */}
      <section className="min-h-[80vh] flex items-center justify-center px-6">

        <div
          className={`w-full max-w-md rounded-3xl p-8 border ${
            darkMode
              ? "bg-[#111] border-[#222]"
              : "bg-white border-gray-200"
          }`}
        >


          {/* Logo */}
          <div className="flex flex-col items-center mb-8">

            <div className="w-14 h-14 rounded-2xl bg-[#C09018] flex items-center justify-center text-white text-2xl font-semibold mb-3">
              T
            </div>


            <h1 className="text-lg font-medium tracking-wider">
              TAP PROFILE
            </h1>


            <p
              className={`text-xs mt-1 ${
                darkMode
                  ? "text-gray-500"
                  : "text-gray-400"
              }`}
            >
              by Identifine
            </p>

          </div>



          {/* Title */}
          <h2 className="text-2xl font-medium text-center">
            Welcome back
          </h2>


          <p
            className={`text-sm text-center mt-2 mb-8 ${
              darkMode
                ? "text-gray-500"
                : "text-gray-600"
            }`}
          >
            Sign in to access your digital profile
          </p>



          {/* Email */}
          <input
            type="text"
            placeholder="Email address or phone number"
            className={`w-full px-4 py-3 rounded-xl mb-4 outline-none text-sm ${
              darkMode
                ? "bg-[#181818] border border-[#292929] text-white"
                : "bg-white border border-gray-300 text-black"
            }`}
          />



          {/* Password */}
          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full px-4 py-3 rounded-xl outline-none text-sm pr-12 ${
                darkMode
                  ? "bg-[#181818] border border-[#292929] text-white"
                  : "bg-white border border-gray-300 text-black"
              }`}
            />


            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-xs text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>



          {/* Options */}
          <div className="flex justify-between items-center mt-4 mb-6 text-xs">

            <label className="flex items-center gap-2 text-gray-500">

              <input
                type="checkbox"
                className="accent-[#C09018]"
              />

              Remember me

            </label>


            <Link
              href="/forgot-password"
              className="text-[#C09018]"
            >
              Forgot password?
            </Link>

          </div>



          {/* Sign In */}
          <button
            className="w-full py-3 rounded-xl bg-[#C09018] text-white font-medium text-sm"
          >
            Sign In
          </button>



          {/* Divider */}
          <div className="flex items-center gap-3 my-6">

            <div
              className={`flex-1 h-px ${
                darkMode
                  ? "bg-[#222]"
                  : "bg-gray-200"
              }`}
            />

            <span className="text-xs text-gray-500">
              or continue with
            </span>


            <div
              className={`flex-1 h-px ${
                darkMode
                  ? "bg-[#222]"
                  : "bg-gray-200"
              }`}
            />

          </div>



          {/* Google */}
          <button
            className={`w-full py-3 rounded-xl text-sm font-medium border ${
              darkMode
                ? "border-[#333] text-gray-300"
                : "border-gray-300 text-gray-700"
            }`}
          >
            Continue with Google
          </button>



          {/* Signup */}
          <p
            className={`text-center text-sm mt-8 ${
              darkMode
                ? "text-gray-500"
                : "text-gray-600"
            }`}
          >
            Don't have an account?{" "}

            <Link
              href="/signup"
              className="text-[#C09018] font-medium"
            >
              Create your profile
            </Link>

          </p>


        </div>

      </section>

    </main>
  );
}