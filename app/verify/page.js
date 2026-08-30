"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {

  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleOtp = (e) => {

    const value = e.target.value.replace(/\D/g, "");

    setOtp(value);

    setError("");

    if (value.length === 6) {

      if (value === "123456") {

        router.push("/username");

      } else {

        setError("Invalid verification code");

      }

    }

  };


  return (

    <main className="min-h-screen bg-[#090909] text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-3xl p-8">


        <div className="w-11 h-11 rounded-xl bg-[#C09018] flex items-center justify-center text-white text-xl font-semibold mx-auto mb-6">
          T
        </div>


        <h1 className="text-2xl font-semibold text-center">
          Verify Your Account
        </h1>


        <p className="text-sm text-gray-500 text-center mt-3 mb-8">
          Enter the 6-digit code sent to your email
        </p>


        <input

          value={otp}

          onChange={handleOtp}

          maxLength="6"

          className="w-full bg-[#181818] border border-[#292929] rounded-xl px-4 py-4 text-center tracking-[0.5em] text-xl outline-none"

          placeholder="------"

        />


        {error && (

          <p className="text-red-500 text-sm text-center mt-4">
            {error}
          </p>

        )}


      </div>

    </main>

  );

}