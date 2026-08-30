"use client";

import { useState } from "react";
import Link from "next/link";
import TapDemo from "./components/TapDemo";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#090909] text-white"
          : "bg-[#f7f7f7] text-[#111]"
      }`}
    >

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">

        <div className="text-xl font-semibold tracking-[0.25em]">
          TAP PROFILE
        </div>


        <div className="flex items-center gap-8 text-sm">

          <button className="hidden md:block">
            Demo
          </button>


          <button className="hidden md:block">
            Pricing
          </button>


          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`rounded-full border px-4 py-2 text-xs transition ${
              darkMode
                ? "border-[#333] text-gray-300"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {darkMode ? "Light" : "Dark"}
          </button>

        </div>

      </nav>



      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">


        {/* Text */}
        <div>


          <h1 className="text-5xl md:text-6xl font-semibold leading-tight">

            Your digital identity.
            <br />
            One tap away.

          </h1>



          <p
            className={`mt-6 text-lg leading-relaxed max-w-xl ${
              darkMode
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >

            Create a smart digital profile for yourself
            or your team. Share your identity instantly
            through NFC, QR code, or a simple link.

          </p>



          <div className="mt-10 flex flex-col sm:flex-row gap-4">


            <Link
              href="/signup"
              className="bg-[#C09018] text-white px-8 py-4 rounded-xl font-medium text-center"
            >

              Create Your Profile

            </Link>



            <Link
              href="/signin"
              className={`px-8 py-4 rounded-xl border font-medium text-center ${
                darkMode
                  ? "border-[#333] text-gray-300"
                  : "border-gray-300 text-gray-700"
              }`}
            >

              Sign In

            </Link>


          </div>



          <div
            className={`mt-8 text-sm ${
              darkMode
                ? "text-gray-500"
                : "text-gray-600"
            }`}
          >

            Build your identity. Share your story. Connect instantly.

          </div>



          {/* Trust points */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-500">

            <span>
              ✓ NFC Ready
            </span>

            <span>
              ✓ QR Sharing
            </span>

            <span>
              ✓ Analytics
            </span>

          </div>


        </div>



        {/* Animation */}
        <div className="flex justify-center">

          <TapDemo />

        </div>


      </section>



      {/* Bottom message */}
      <section className="max-w-7xl mx-auto px-8 pb-10">

        <div
          className={`text-center text-sm ${
            darkMode
              ? "text-gray-600"
              : "text-gray-500"
          }`}
        >

          Digital profiles for individuals and modern businesses.

        </div>

      </section>


    </main>
  );
}