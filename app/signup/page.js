"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [mode, setMode] = useState("individual");
  const [darkMode, setDarkMode] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  const [error, setError] = useState("");

  const dark = darkMode;


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  const validate = () => {

    if (!form.fullName.trim()) {
      return "Full name is required";
    }


    if (mode === "business" && !form.companyName.trim()) {
      return "Company name is required";
    }


    if (!form.email.trim()) {
      return "Email address is required";
    }


    const emailCheck =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailCheck.test(form.email)) {
      return "Enter a valid email address";
    }


    if (mode === "individual") {

      if (!form.phone.trim()) {
        return "Phone number is required";
      }


      if (!/^[0-9+]{10,15}$/.test(form.phone)) {
        return "Enter a valid phone number";
      }

    }


    if (mode === "business" && !form.role.trim()) {
      return "Your role is required";
    }


    if (!form.password) {
      return "Password is required";
    }


    if (form.password.length < 8) {
      return "Password must be at least 8 characters";
    }


    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      return "Password must contain letters and numbers";
    }


    return "";

  };


  const createAccount = () => {

    const validationError = validate();


    if (validationError) {
      setError(validationError);
      return;
    }


    setError("");

    router.push("/verify");

  };


  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-[#090909] text-white"
          : "bg-[#f7f7f7] text-[#111]"
      }`}
    >

      <header className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#C09018] flex items-center justify-center text-white text-xl font-semibold">
            T
          </div>

          <div>
            <div className="font-semibold tracking-[0.2em] text-sm">
              TAP PROFILE
            </div>

            <div className="text-xs text-gray-500">
              Digital identity platform
            </div>
          </div>

        </div>


        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-full text-xs border ${
            dark
              ? "border-[#333] text-gray-300"
              : "border-gray-300 text-gray-600"
          }`}
        >
          {dark ? "Light" : "Dark"}
        </button>

      </header>
            <section className="flex justify-center px-6 py-8">

        <div
          className={`w-full max-w-md rounded-3xl p-8 ${
            dark
              ? "bg-[#111] border border-[#222]"
              : "bg-white border border-gray-200"
          }`}
        >

          <h1 className="text-3xl font-semibold text-center">
            Create Account
          </h1>


          <p className={`text-sm text-center mt-3 mb-8 ${
            dark ? "text-gray-500" : "text-gray-600"
          }`}>
            Create your digital identity in a few simple steps
          </p>



          <div className={`flex rounded-xl p-1 mb-7 ${
            dark ? "bg-[#191919]" : "bg-gray-100"
          }`}>

            <button
              onClick={() => setMode("individual")}
              className={`flex-1 py-3 rounded-lg text-sm ${
                mode === "individual"
                  ? "bg-[#C09018] text-white"
                  : "text-gray-500"
              }`}
            >
              Individual
            </button>


            <button
              onClick={() => setMode("business")}
              className={`flex-1 py-3 rounded-lg text-sm ${
                mode === "business"
                  ? "bg-[#C09018] text-white"
                  : "text-gray-500"
              }`}
            >
              Business
            </button>

          </div>



          <div className="space-y-4">


            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${
                dark
                  ? "bg-[#181818] border border-[#292929]"
                  : "bg-white border border-gray-300"
              }`}
              placeholder="Full Name"
            />



            {mode === "business" && (
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${
                  dark
                    ? "bg-[#181818] border border-[#292929]"
                    : "bg-white border border-gray-300"
                }`}
                placeholder="Company Name"
              />
            )}



            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${
                dark
                  ? "bg-[#181818] border border-[#292929]"
                  : "bg-white border border-gray-300"
              }`}
              placeholder={
                mode === "business"
                  ? "Organization Email"
                  : "Email Address"
              }
            />



            {mode === "individual" && (
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${
                  dark
                    ? "bg-[#181818] border border-[#292929]"
                    : "bg-white border border-gray-300"
                }`}
                placeholder="Phone Number"
              />
            )}



            {mode === "business" && (
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${
                  dark
                    ? "bg-[#181818] border border-[#292929]"
                    : "bg-white border border-gray-300"
                }`}
                placeholder="Your Role"
              />
            )}



            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${
                dark
                  ? "bg-[#181818] border border-[#292929]"
                  : "bg-white border border-gray-300"
              }`}
              placeholder="Password"
              type="password"
            />

          </div>



          <p className="text-xs text-gray-500 mt-3">
            Password must contain at least 8 characters with letters and numbers.
          </p>



          {error && (
            <div className="mt-4 text-sm text-red-500 text-center">
              {error}
            </div>
          )}



          {mode === "individual" && (

            <>

              <div className="flex items-center gap-3 my-6">

                <div className={`h-px flex-1 ${
                  dark ? "bg-[#333]" : "bg-gray-200"
                }`}></div>

                <span className="text-xs text-gray-500">
                  or continue with
                </span>

                <div className={`h-px flex-1 ${
                  dark ? "bg-[#333]" : "bg-gray-200"
                }`}></div>

              </div>



              <button
                className={`w-full py-3 rounded-xl text-sm border ${
                  dark
                    ? "border-[#333]"
                    : "border-gray-300"
                }`}
              >
                Continue with Google
              </button>

            </>

          )}



          {mode === "business" && (
            <div className="mt-5 text-xs text-gray-500">
              Business accounts require an organization email address.
            </div>
          )}



          <button
            onClick={createAccount}
            className="w-full mt-6 py-3 px-3 rounded-xl bg-[#C09018] text-white text-sm font-medium hover:opacity-90 transition leading-tight"
          >
            {mode === "business"
              ? "Create Business Account"
              : "Create Account"}
          </button>



          <p className="text-center text-sm text-gray-500 mt-6">

            Already have an account?

            <a
              href="/signin"
              className="text-[#C09018] ml-1 cursor-pointer"
            >
              Sign In
            </a>

          </p>


        </div>

      </section>


    </main>
  );
}