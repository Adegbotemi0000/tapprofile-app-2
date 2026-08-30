"use client";

import { motion } from "framer-motion";

export default function TapDemo() {
  return (
    <div className="relative w-full max-w-md h-[520px] flex items-center justify-center">

      {/* NFC Waves */}
      <motion.div
        className="absolute right-[115px] top-[170px] w-24 h-24 rounded-full border border-[#C09018]"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.8, 0.2, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute right-[100px] top-[155px] w-32 h-32 rounded-full border border-[#C09018]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.3,
        }}
      />


      {/* NFC Card */}
      <motion.div
        className="absolute left-5 top-28 w-52 h-32 rounded-2xl bg-gradient-to-br from-[#222] to-[#111] border border-[#333] shadow-2xl p-5 z-10"
        animate={{
          x: [0, 90, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >

        <div className="text-[#C09018] text-lg font-semibold tracking-widest">
          TAP PROFILE
        </div>

        <div className="mt-8 text-white text-sm">
          John Adebayo
        </div>

        <div className="text-gray-500 text-xs">
          CEO • ABC Limited
        </div>

      </motion.div>



      {/* Phone */}
      <motion.div
        className="absolute right-5 top-16 w-56 h-[420px] rounded-[35px] bg-black border-[8px] border-[#222] shadow-2xl overflow-hidden"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >

        <div className="h-full bg-[#0e0e0e] p-5">

          <div className="w-12 h-12 rounded-full bg-[#C09018] flex items-center justify-center mx-auto mt-5 text-white font-medium">
            JA
          </div>


          <h3 className="text-white text-center mt-5 text-lg">
            John Adebayo
          </h3>


          <p className="text-gray-500 text-center text-xs">
            CEO, ABC Limited
          </p>


          <div className="mt-8 space-y-3">

            <div className="bg-[#181818] rounded-xl p-3 text-center text-xs text-gray-300">
              Call
            </div>

            <div className="bg-[#181818] rounded-xl p-3 text-center text-xs text-gray-300">
              Email
            </div>

            <div className="bg-[#181818] rounded-xl p-3 text-center text-xs text-gray-300">
              Save Contact
            </div>

          </div>


          <div className="mt-8 flex justify-center">

            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-black text-xs">
              QR
            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
}