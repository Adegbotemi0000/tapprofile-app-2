export default function ProfileCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-gray-800 bg-[#161616] p-6 shadow-2xl">
      
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-xl">
          GP
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Gbotemi
          </h2>

          <p className="text-sm text-gray-400">
            Founder, TapProfile
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        A smart digital identity profile that helps you share your
        information instantly.
      </p>

      <div className="mt-6 space-y-3">
        <button className="w-full rounded-xl bg-white py-3 font-medium text-black">
          Save Contact
        </button>

        <button className="w-full rounded-xl border border-gray-700 py-3">
          Connect
        </button>
      </div>

      <div className="mt-6 rounded-xl bg-[#222] p-4 text-center">
        <p className="text-xs text-gray-400">
          Powered by TapProfile
        </p>
      </div>

    </div>
  );
}