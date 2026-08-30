"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

export default function SharePage() {
  const router = useRouter();

  const qrCanvasRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        "tapprofile_profile"
      );

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Unable to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  function getProfilePath() {
    if (!profile) {
      return "/profile/user";
    }

    const name =
      profile.fullName ||
      profile.company ||
      "user";

    const username = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `/profile/${username || "user"}`;
  }

  function getProfileUrl() {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}${getProfilePath()}`;
  }

  useEffect(() => {
    if (!profile) return;

    const generateQRCode = async () => {
      try {
        const canvas = qrCanvasRef.current;

        if (!canvas) return;

        const url = getProfileUrl();

        await QRCode.toCanvas(canvas, url, {
          width: 220,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#111111",
            light: "#ffffff",
          },
        });

        setQrReady(true);
      } catch (error) {
        console.error(
          "Unable to generate QR code:",
          error
        );
      }
    };

    generateQRCode();
  }, [profile]);

  function getDisplayName() {
    return (
      profile?.fullName ||
      profile?.company ||
      "TapProfile User"
    );
  }

  function getInitials() {
    const name = getDisplayName();

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  }

  async function copyProfileLink() {
    const url = getProfileUrl();

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);

      alert(url);
    }
  }

  async function shareProfile() {
    const url = getProfileUrl();
    const name = getDisplayName();

    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `View ${name}'s TapProfile`,
          url,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }

      return;
    }

    await copyProfileLink();
  }

  function downloadQR() {
    const canvas = qrCanvasRef.current;

    if (!canvas || !qrReady) {
      return;
    }

    const link = document.createElement("a");

    link.download = `${getDisplayName()
      .replace(/\s+/g, "-")
      .toLowerCase()}-tapprofile-qr.png`;

    link.href = canvas.toDataURL("image/png");

    document.body.appendChild(link);

    link.click();

    link.remove();
  }

  function goBack() {
    router.back();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f6f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 rounded-full border-2 border-gray-200 border-t-[#C09018] animate-spin mx-auto" />

          <p className="text-sm text-gray-500 mt-4">
            Loading share page...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#f6f6f4] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#C09018] flex items-center justify-center mx-auto text-2xl font-bold text-black">
            T
          </div>

          <h1 className="text-2xl font-semibold text-[#111] mt-6">
            Profile not found
          </h1>

          <p className="text-sm text-gray-500 mt-2 leading-6">
            Create your TapProfile before sharing it.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/profile-setup")
            }
            className="mt-6 px-6 py-3 rounded-xl bg-[#C09018] text-black text-sm font-semibold"
          >
            Create Profile
          </button>
        </div>
      </main>
    );
  }

  const displayName = getDisplayName();

  const title =
    profile.title ||
    profile.company ||
    "Digital Profile";

  const profileUrl = getProfileUrl();

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-[#111]">

      {/* HEADER */}

      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-black/[0.06]">

        <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">

          <button
            type="button"
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#f3f3f1] flex items-center justify-center text-lg"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="text-center">
            <h1 className="font-semibold text-lg">
              Share Profile
            </h1>

            <p className="text-[10px] text-gray-500 uppercase tracking-[0.16em] mt-0.5">
              Your digital identity
            </p>
          </div>

          <div className="w-10 h-10" />

        </div>

      </header>


      <section className="max-w-xl mx-auto px-5 py-7">

        {/* PROFILE SUMMARY */}

        <div className="bg-white rounded-3xl border border-gray-200 p-5">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#C09018] flex items-center justify-center shrink-0">

              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-black">
                  {getInitials()}
                </span>
              )}

            </div>

            <div className="min-w-0">

              <h2 className="font-semibold text-lg truncate">
                {displayName}
              </h2>

              <p className="text-sm text-[#C09018] mt-1 truncate">
                {title}
              </p>

            </div>

          </div>

        </div>


        {/* QR SECTION */}

        <div className="bg-white rounded-3xl border border-gray-200 mt-4 p-6">

          <div className="text-center">

            <h2 className="text-lg font-semibold">
              Your QR Code
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Scan this code to open your TapProfile.
            </p>

          </div>


          <div className="mt-6 flex justify-center">

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

              <canvas
                ref={qrCanvasRef}
                width={220}
                height={220}
                className="w-[220px] h-[220px]"
              />

            </div>

          </div>


          <button
            type="button"
            onClick={downloadQR}
            disabled={!qrReady}
            className="w-full mt-5 py-3.5 rounded-xl bg-[#C09018] text-black text-sm font-semibold disabled:opacity-50"
          >
            Download QR Code
          </button>

        </div>


        {/* PROFILE LINK */}

        <div className="bg-white rounded-3xl border border-gray-200 mt-4 p-6">

          <h2 className="font-semibold">
            Profile Link
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Share this link with anyone.
          </p>


          <div className="mt-4 rounded-xl bg-[#f6f6f4] border border-gray-200 px-4 py-3">

            <p className="text-xs text-gray-700 break-all">
              {profileUrl}
            </p>

          </div>


          <button
            type="button"
            onClick={copyProfileLink}
            className="w-full mt-3 py-3.5 rounded-xl border border-[#C09018] text-[#C09018] text-sm font-semibold"
          >
            {copied ? "Link Copied!" : "Copy Profile Link"}
          </button>

        </div>


        {/* SHARE */}

        <div className="bg-white rounded-3xl border border-gray-200 mt-4 p-6">

          <h2 className="font-semibold">
            Share Your Profile
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Send your TapProfile directly through your phone or browser.
          </p>


          <button
            type="button"
            onClick={shareProfile}
            className="w-full mt-5 py-3.5 rounded-xl bg-[#111] text-white text-sm font-semibold"
          >
            Share Profile
          </button>

        </div>


        {/* VIEW PROFILE */}

        <button
          type="button"
          onClick={() =>
            router.push(getProfilePath())
          }
          className="w-full mt-4 py-3.5 rounded-xl text-sm font-semibold text-[#C09018]"
        >
          View Public Profile →
        </button>


        <p className="text-center text-[11px] text-gray-400 mt-8 mb-8">
          TapProfile · A digital identity that stays with you.
        </p>

      </section>

    </main>
  );
}