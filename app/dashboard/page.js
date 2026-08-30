"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        "tapprofile_profile"
      );

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Unable to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  function getProfilePath() {
    if (!profile) {
      return "/profile";
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

  function openShare() {
    router.push("/share");
  }

  function openAccount() {
    setAccountOpen(true);
  }

  function closeAccount() {
    setAccountOpen(false);
  }

  function getCompletion() {
    if (!profile) return 0;

    const fields = [
      profile.fullName,
      profile.title,
      profile.company,
      profile.bio,
      profile.profilePhoto,
      profile.personalEmail,
      profile.officialEmail,
      profile.personalPhone,
      profile.officialPhone,
      profile.address,
      profile.website,
      profile.linkedin,
      profile.instagram,
      profile.twitter,
      profile.facebook,
      profile.whatsapp,
      profile.linktree,
      profile.coverImage,
    ];

    const completed = fields.filter(
      (field) =>
        typeof field === "string" &&
        field.trim().length > 0
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }

  function getInitials() {
    if (!profile) return "T";

    const name =
      profile.fullName ||
      profile.company ||
      "TapProfile";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  }

  function editProfile() {
    router.push("/profile-setup");
  }

  function viewProfile() {
    router.push(getProfilePath());
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 rounded-full border-2 border-gray-200 border-t-[#C09018] animate-spin mx-auto" />

          <p className="text-sm text-gray-500 mt-4">
            Loading dashboard...
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
            Complete your profile
          </h1>

          <p className="text-sm text-gray-500 mt-2 leading-6">
            You have not created your TapProfile yet.
          </p>

          <button
            type="button"
            onClick={editProfile}
            className="mt-6 px-6 py-3 rounded-xl bg-[#C09018] text-black text-sm font-semibold"
          >
            Create Profile
          </button>
        </div>
      </main>
    );
  }

  const dark = darkMode;

  const completion = getCompletion();

  const displayName =
    profile.fullName ||
    profile.company ||
    "TapProfile User";

  const title =
    profile.title ||
    "Add your professional title";

  const company =
    profile.company ||
    "Add your company or organisation";

  const publicUrl = getProfileUrl();

  return (
    <main
      className={`min-h-screen pb-28 transition-colors ${
        dark
          ? "bg-[#070707] text-white"
          : "bg-[#f6f6f4] text-[#111]"
      }`}
    >
      {/* HEADER */}

      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
          dark
            ? "bg-[#070707]/90 border-white/[0.07]"
            : "bg-white/90 border-black/[0.07]"
        }`}
      >
        <div className="max-w-xl mx-auto px-5 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              My Dashboard
            </h1>

            <p className="text-[#C09018] text-[10px] uppercase tracking-[0.2em] mt-1.5">
              Individual Account
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={openShare}
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                dark
                  ? "bg-[#111] border-[#292929]"
                  : "bg-white border-gray-200"
              }`}
              aria-label="Share profile"
            >
              ↗
            </button>

            <button
              type="button"
              onClick={() =>
                setDarkMode((value) => !value)
              }
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                dark
                  ? "bg-[#111] border-[#292929]"
                  : "bg-white border-gray-200"
              }`}
              aria-label="Toggle theme"
            >
              ☼
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-xl mx-auto px-5 py-6 space-y-5">

        {/* PROFILE PREVIEW */}

        <div
          className={`overflow-hidden rounded-3xl border ${
            dark
              ? "bg-[#111] border-[#1f1f1f]"
              : "bg-white border-gray-200"
          }`}
        >
          {/* COVER */}

          <div className="h-32 relative overflow-hidden">
            {profile.coverImage ? (
              <img
                src={profile.coverImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #171717, #30240a, #090909)",
                }}
              />
            )}

            <button
              type="button"
              onClick={editProfile}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/50 border border-white/20 text-white text-[11px]"
            >
              Edit
            </button>
          </div>

          {/* PROFILE */}

          <div className="px-5 pb-5">
            <div className="-mt-10 relative">
              <div
                className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                  dark
                    ? "border-[#111]"
                    : "border-white"
                } bg-[#C09018] flex items-center justify-center`}
              >
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-black">
                    {getInitials()}
                  </span>
                )}
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-4">
              {displayName}
            </h2>

            <p className="text-[#C09018] text-sm mt-1">
              {title}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              {company}
            </p>

            <p className="text-gray-500 text-xs mt-3 truncate">
              {publicUrl}
            </p>

            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <button
                type="button"
                onClick={viewProfile}
                className="py-3 rounded-xl border border-[#C09018] text-[#C09018] text-sm font-medium"
              >
                Preview Profile
              </button>

              <button
                type="button"
                onClick={openShare}
                className="py-3 rounded-xl bg-[#C09018] text-black text-sm font-semibold"
              >
                Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* PROFILE COMPLETION */}

        <div
          className={`rounded-3xl p-5 border ${
            dark
              ? "bg-[#111] border-[#1f1f1f]"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">
                Profile completion
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Keep adding information to strengthen your profile.
              </p>
            </div>

            <span className="text-[#C09018] font-bold">
              {completion}%
            </span>
          </div>

          <div
            className={`mt-4 h-2 rounded-full overflow-hidden ${
              dark ? "bg-[#252525]" : "bg-gray-200"
            }`}
          >
            <div
              className="h-full bg-[#C09018] transition-all"
              style={{
                width: `${completion}%`,
              }}
            />
          </div>

          <button
            type="button"
            onClick={editProfile}
            className="w-full mt-4 py-3 rounded-xl border border-[#C09018] text-[#C09018] text-sm font-medium"
          >
            Edit Profile
          </button>
        </div>

        {/* QUICK ACTIONS */}

        <div
          className={`rounded-3xl p-5 border ${
            dark
              ? "bg-[#111] border-[#1f1f1f]"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">
              Quick Actions
            </h2>

            <button
              type="button"
              onClick={editProfile}
              className="text-xs text-[#C09018]"
            >
              Manage
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ActionCard
              icon="✎"
              title="Edit Profile"
              dark={dark}
              onClick={editProfile}
            />

            <ActionCard
              icon="↗"
              title="Share Profile"
              dark={dark}
              onClick={openShare}
            />

            <ActionCard
              icon="▣"
              title="View Profile"
              dark={dark}
              onClick={viewProfile}
            />

            <ActionCard
              icon="QR"
              title="Share QR"
              dark={dark}
              onClick={openShare}
            />
          </div>
        </div>

        {/* PROFILE INFORMATION */}

        <DashboardSection
          title="Profile Information"
          description={
            profile.bio
              ? profile.bio
              : "Name, title, company and biography"
          }
          dark={dark}
          onClick={editProfile}
        />

        <DashboardSection
          title="Contact Details"
          description={
            profile.personalEmail ||
            profile.officialEmail ||
            profile.personalPhone ||
            profile.officialPhone
              ? "Contact information added"
              : "No contact information added yet"
          }
          dark={dark}
          onClick={editProfile}
        />

        <DashboardSection
          title="Links & Socials"
          description={
            profile.website ||
            profile.linkedin ||
            profile.instagram ||
            profile.twitter
              ? "Your online links are connected"
              : "No links added yet"
          }
          dark={dark}
          onClick={editProfile}
        />

        <DashboardSection
          title="Work Gallery"
          description="Manage your work images"
          dark={dark}
          onClick={editProfile}
        />

        <DashboardSection
          title="Portfolio / CV"
          description="Manage your portfolio document"
          dark={dark}
          onClick={editProfile}
        />

        <DashboardSection
          title="Appearance"
          description="Profile photo, cover image and profile style"
          dark={dark}
          onClick={editProfile}
        />

        {/* ACCOUNT */}

        <button
          type="button"
          onClick={openAccount}
          className={`w-full rounded-3xl p-5 border text-left ${
            dark
              ? "bg-[#111] border-[#1f1f1f]"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">
                Account
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Account settings and profile link
              </p>
            </div>

            <span className="text-[#C09018] text-xl">
              ›
            </span>
          </div>
        </button>
      </section>

      {/* BOTTOM NAVIGATION */}

      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 h-[72px] flex justify-around items-center backdrop-blur-xl ${
          dark
            ? "bg-[#0d0d0d]/95 border-t border-[#222]"
            : "bg-white/95 border-t border-gray-200"
        }`}
      >
        <button
          type="button"
          className="flex flex-col items-center gap-1 text-[10px] text-[#C09018]"
        >
          <span className="text-lg">
            ⌂
          </span>
          Home
        </button>

        <button
          type="button"
          onClick={editProfile}
          className="flex flex-col items-center gap-1 text-[10px] text-gray-500"
        >
          <span className="text-lg">
            ✎
          </span>
          Edit
        </button>

        <button
          type="button"
          onClick={openShare}
          className="flex flex-col items-center gap-1 text-[10px] text-gray-500"
        >
          <span className="text-lg">
            ↗
          </span>
          Share
        </button>

        <button
          type="button"
          onClick={openAccount}
          className="flex flex-col items-center gap-1 text-[10px] text-gray-500"
        >
          <span className="text-lg">
            ◯
          </span>
          Account
        </button>
      </nav>

      {/* ACCOUNT MODAL */}

      {accountOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <button
            type="button"
            onClick={closeAccount}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
          />

          <div
            className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 ${
              dark
                ? "bg-[#111] text-white"
                : "bg-white text-[#111]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Account
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Manage your TapProfile account.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAccount}
                className="w-9 h-9 rounded-full bg-gray-500/10 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#C09018] flex items-center justify-center">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-black">
                    {getInitials()}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {displayName}
                </p>

                <p className="text-xs text-gray-500 mt-1 truncate">
                  {publicUrl}
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  closeAccount();
                  editProfile();
                }}
                className={`w-full text-left p-4 rounded-xl ${
                  dark
                    ? "bg-[#181818]"
                    : "bg-gray-100"
                }`}
              >
                <p className="text-sm font-medium">
                  Edit Profile
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Change your profile information
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeAccount();
                  openShare();
                }}
                className={`w-full text-left p-4 rounded-xl ${
                  dark
                    ? "bg-[#181818]"
                    : "bg-gray-100"
                }`}
              >
                <p className="text-sm font-medium">
                  Share Profile
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Open your sharing page
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ACTION CARD */

function ActionCard({
  icon,
  title,
  dark,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl p-4 text-center transition active:scale-[0.98] ${
        dark
          ? "bg-[#181818]"
          : "bg-gray-100"
      }`}
    >
      <div className="text-xl mb-2">
        {icon}
      </div>

      <p className="text-xs text-gray-400">
        {title}
      </p>
    </button>
  );
}

/* DASHBOARD SECTION */

function DashboardSection({
  title,
  description,
  dark,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl p-5 flex justify-between items-center text-left ${
        dark
          ? "bg-[#111] border border-[#1f1f1f]"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="min-w-0 pr-4">
        <h3 className="font-medium">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-1 truncate">
          {description}
        </p>
      </div>

      <span className="text-[#C09018] text-lg shrink-0">
        ›
      </span>
    </button>
  );
}