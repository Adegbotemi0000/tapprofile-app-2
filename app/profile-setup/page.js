"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PORTFOLIO_SIZE = 15 * 1024 * 1024;
const MAX_WORK_IMAGES = 5;

/*
  The original uploaded image can be up to 5MB.

  Before anything is stored in localStorage, images are:
  1. resized
  2. converted to JPEG
  3. compressed

  This keeps the prototype from hitting the browser's
  localStorage quota.
*/

const PROFILE_IMAGE_MAX_WIDTH = 800;
const PROFILE_IMAGE_MAX_HEIGHT = 800;

const COVER_IMAGE_MAX_WIDTH = 1400;
const COVER_IMAGE_MAX_HEIGHT = 700;

const BACKGROUND_IMAGE_MAX_WIDTH = 1400;
const BACKGROUND_IMAGE_MAX_HEIGHT = 1000;

const WORK_IMAGE_MAX_WIDTH = 700;
const WORK_IMAGE_MAX_HEIGHT = 700;

const IMAGE_QUALITY = 0.78;

const COLORS = [
  "#C09018",
  "#D4A017",
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#DC2626",
  "#EA580C",
  "#059669",
  "#0891B2",
  "#111111",
];

export default function ProfileSetupPage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    prefix: "",
    fullName: "",
    title: "",
    company: "",
    suffix: "",
    bio: "",

    personalEmail: "",
    officialEmail: "",
    personalPhone: "",
    officialPhone: "",
    address: "",

    website: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    facebook: "",
    whatsapp: "",
    linktree: "",
    customLink1: "",
    customLink2: "",

    profilePhoto: "",
    coverImage: "",
    backgroundImage: "",

    profileMode: "dark",
    accentColor: "#C09018",
  });

  const [portfolio, setPortfolio] = useState(null);
  const [workImages, setWorkImages] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tapprofile_profile");

      if (saved) {
        const parsed = JSON.parse(saved);

        setForm((current) => ({
          ...current,
          ...parsed,
        }));
      }

      const savedPortfolioName = localStorage.getItem(
        "tapprofile_portfolio_name"
      );

      const savedPortfolioSize = localStorage.getItem(
        "tapprofile_portfolio_size"
      );

      if (savedPortfolioName) {
        setPortfolio({
          name: savedPortfolioName,
          size: Number(savedPortfolioSize || 0),
        });
      }

      const savedImages = localStorage.getItem(
        "tapprofile_work_images"
      );

      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);

        if (Array.isArray(parsedImages)) {
          setWorkImages(parsedImages.slice(0, MAX_WORK_IMAGES));
        }
      }
    } catch (error) {
      console.error("Unable to load profile:", error);

      /*
        If old oversized/corrupted work-image data exists,
        remove it so the new system can work normally.
      */

      try {
        localStorage.removeItem("tapprofile_work_images");
      } catch (storageError) {
        console.error(storageError);
      }
    }
  }, []);

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /*
    Compress an image before storing it.

    This is the important fix for the localStorage quota problem.
  */

  function compressImage(
    file,
    maxWidth,
    maxHeight,
    quality = IMAGE_QUALITY
  ) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          let width = image.width;
          let height = image.height;

          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;

          const ratio = Math.min(
            1,
            widthRatio,
            heightRatio
          );

          width = Math.round(width * ratio);
          height = Math.round(height * ratio);

          const canvas = document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext("2d");

          if (!context) {
            reject(
              new Error("Unable to process image.")
            );
            return;
          }

          context.drawImage(
            image,
            0,
            0,
            width,
            height
          );

          const compressed = canvas.toDataURL(
            "image/jpeg",
            quality
          );

          resolve(compressed);
        };

        image.onerror = () => {
          reject(
            new Error("Unable to read image.")
          );
        };

        image.src = reader.result;
      };

      reader.onerror = () => {
        reject(
          new Error("Unable to read selected file.")
        );
      };

      reader.readAsDataURL(file);
    });
  }

  async function uploadImage(event, field) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    try {
      let maxWidth = PROFILE_IMAGE_MAX_WIDTH;
      let maxHeight = PROFILE_IMAGE_MAX_HEIGHT;

      if (field === "coverImage") {
        maxWidth = COVER_IMAGE_MAX_WIDTH;
        maxHeight = COVER_IMAGE_MAX_HEIGHT;
      }

      if (field === "backgroundImage") {
        maxWidth = BACKGROUND_IMAGE_MAX_WIDTH;
        maxHeight = BACKGROUND_IMAGE_MAX_HEIGHT;
      }

      const compressedImage = await compressImage(
        file,
        maxWidth,
        maxHeight
      );

      updateField(field, compressedImage);
    } catch (error) {
      console.error(error);

      alert(
        "The image could not be processed. Please try another image."
      );
    }

    event.target.value = "";
  }

  function removeImage(field) {
    updateField(field, "");
  }

  async function uploadWorkImages(event) {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;

    const availableSlots =
      MAX_WORK_IMAGES - workImages.length;

    if (availableSlots <= 0) {
      alert(
        "You can upload a maximum of 5 work images."
      );

      event.target.value = "";
      return;
    }

    const selected = files.slice(
      0,
      availableSlots
    );

    const newImages = [];

    for (const file of selected) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert(
          `${file.name} is larger than 5MB and was skipped.`
        );

        continue;
      }

      try {
        const compressedImage =
          await compressImage(
            file,
            WORK_IMAGE_MAX_WIDTH,
            WORK_IMAGE_MAX_HEIGHT,
            0.72
          );

        newImages.push({
          name: file.name,
          data: compressedImage,
        });
      } catch (error) {
        console.error(error);

        alert(
          `${file.name} could not be processed.`
        );
      }
    }

    if (newImages.length) {
      setWorkImages((current) => {
        const combined = [
          ...current,
          ...newImages,
        ];

        return combined.slice(
          0,
          MAX_WORK_IMAGES
        );
      });
    }

    event.target.value = "";
  }

  function removeWorkImage(index) {
    setWorkImages((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function uploadPortfolio(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension =
      file.name.split(".").pop()?.toLowerCase();

    if (
      !["pdf", "doc", "docx"].includes(extension)
    ) {
      alert(
        "Portfolio must be PDF, DOC or DOCX."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_PORTFOLIO_SIZE) {
      alert(
        "Portfolio must not exceed 15MB."
      );

      event.target.value = "";
      return;
    }

    /*
      Do NOT store the actual portfolio file in
      localStorage.

      The future backend/storage system will handle
      the actual document.

      For this prototype we only store:
      filename
      size
    */

    setPortfolio({
      name: file.name,
      size: file.size,
      type: file.type,
      extension,
    });

    event.target.value = "";
  }

  function removePortfolio() {
    setPortfolio(null);

    localStorage.removeItem(
      "tapprofile_portfolio_name"
    );

    localStorage.removeItem(
      "tapprofile_portfolio_size"
    );
  }

  function formatSize(bytes) {
    if (!bytes) return "0 KB";

    if (bytes >= 1024 * 1024) {
      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${Math.round(
      bytes / 1024
    )} KB`;
  }

  /*
    Safely save work images.

    If the browser still rejects the gallery,
    we progressively reduce the gallery instead
    of crashing the whole save operation.
  */

  function saveWorkImagesSafely() {
    const imagesToSave = workImages
      .slice(0, MAX_WORK_IMAGES)
      .map((image) => ({
        name: image.name,
        data: image.data,
      }));

    try {
      localStorage.setItem(
        "tapprofile_work_images",
        JSON.stringify(imagesToSave)
      );

      return true;
    } catch (error) {
      console.warn(
        "Could not save full work gallery.",
        error
      );
    }

    /*
      Try progressively smaller galleries.
    */

    for (
      let count = imagesToSave.length - 1;
      count >= 1;
      count--
    ) {
      try {
        localStorage.setItem(
          "tapprofile_work_images",
          JSON.stringify(
            imagesToSave.slice(0, count)
          )
        );

        setWorkImages((current) =>
          current.slice(0, count)
        );

        alert(
          `Your profile was saved, but only ${count} work image${
            count === 1 ? "" : "s"
          } could be stored in this browser.`
        );

        return true;
      } catch (retryError) {
        console.warn(
          `Could not save ${count} work images.`,
          retryError
        );
      }
    }

    /*
      If even one image cannot be stored,
      clear only the gallery storage.

      The rest of the profile can still be saved.
    */

    try {
      localStorage.removeItem(
        "tapprofile_work_images"
      );
    } catch (removeError) {
      console.error(removeError);
    }

    setWorkImages([]);

    alert(
      "Your profile details were saved, but the work gallery could not be stored in this browser. The gallery will be connected to proper file storage when the backend is added."
    );

    return false;
  }

  function saveProfile() {
    if (!form.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    setSaving(true);

    try {
      /*
        Save profile information.

        Images have already been compressed before
        reaching this point.
      */

      const profileForStorage = {
        ...form,
      };

      localStorage.setItem(
        "tapprofile_profile",
        JSON.stringify(profileForStorage)
      );

      /*
        Portfolio:
        Only metadata is saved.
      */

      if (portfolio) {
        localStorage.setItem(
          "tapprofile_portfolio_name",
          portfolio.name
        );

        localStorage.setItem(
          "tapprofile_portfolio_size",
          String(portfolio.size)
        );
      } else {
        localStorage.removeItem(
          "tapprofile_portfolio_name"
        );

        localStorage.removeItem(
          "tapprofile_portfolio_size"
        );
      }

      /*
        Work gallery:
        Save compressed thumbnails only.
      */

      saveWorkImagesSafely();

      localStorage.setItem(
        "tapprofile_profile_completed",
        "true"
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 350);
    } catch (error) {
      console.error(
        "Profile save error:",
        error
      );

      alert(
        "The profile could not be saved. Please try again."
      );

      setSaving(false);
    }
  }

  const dark = darkMode;

  return (
    <main
      className={
        dark
          ? "min-h-screen bg-[#070707] text-white"
          : "min-h-screen bg-[#f5f5f3] text-[#111]"
      }
    >
      {/* HEADER */}

      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          dark
            ? "bg-[#070707]/90 border-white/[0.07]"
            : "bg-white/90 border-black/[0.07]"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black"
              style={{
                backgroundColor:
                  form.accentColor,
              }}
            >
              T
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.18em]">
                TAP PROFILE
              </p>

              <p className="text-[11px] text-gray-500">
                Profile setup
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setDarkMode((value) => !value)
            }
            className={`w-10 h-10 rounded-full border flex items-center justify-center ${
              dark
                ? "border-[#292929]"
                : "border-gray-300"
            }`}
          >
            {dark ? "☼" : "☾"}
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-32">
        <div className="py-8 sm:py-10">
          <p
            className="text-[11px] uppercase tracking-[0.22em] font-semibold"
            style={{
              color: form.accentColor,
            }}
          >
            Individual profile
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold mt-2">
            Build your profile
          </h1>

          <p className="text-sm text-gray-500 mt-3 max-w-2xl leading-6">
            Add the information you want people
            to see when they visit your TapProfile.
            You can edit everything later.
          </p>
        </div>

        <div className="space-y-5">
          {/* IDENTITY */}

          <Card
            dark={dark}
            title="Identity"
            description="Your name and professional identity."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Prefix"
                value={form.prefix}
                placeholder="Dr."
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "prefix",
                    value
                  )
                }
              />

              <div className="sm:col-span-2">
                <Field
                  label="Full name"
                  value={form.fullName}
                  placeholder="Your full name"
                  required
                  dark={dark}
                  onChange={(value) =>
                    updateField(
                      "fullName",
                      value
                    )
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Field
                label="Professional title"
                value={form.title}
                placeholder="Chief Executive Officer"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "title",
                    value
                  )
                }
              />

              <Field
                label="Company / organisation"
                value={form.company}
                placeholder="Company name"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "company",
                    value
                  )
                }
              />
            </div>

            <div className="mt-4">
              <Field
                label="Suffix / qualifications"
                value={form.suffix}
                placeholder="MBA, MSc, PhD, PMP"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "suffix",
                    value
                  )
                }
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">
                Bio
              </label>

              <textarea
                value={form.bio}
                maxLength={500}
                rows={4}
                onChange={(e) =>
                  updateField(
                    "bio",
                    e.target.value
                  )
                }
                placeholder="A short introduction about yourself..."
                className={`w-full mt-2 rounded-xl px-4 py-3 text-sm resize-none outline-none ${
                  dark
                    ? "bg-[#181818] border border-[#292929] placeholder:text-gray-700"
                    : "bg-white border border-gray-300 placeholder:text-gray-400"
                }`}
              />

              <p className="text-[11px] text-gray-500 text-right mt-1">
                {form.bio.length}/500
              </p>
            </div>
          </Card>

          {/* PROFILE PHOTO */}

          <Card
            dark={dark}
            title="Profile photo"
            description="This is the main image people will see on your profile."
          >
            <div className="flex items-center gap-4 sm:gap-5">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor:
                    form.accentColor,
                }}
              >
                {form.profilePhoto ? (
                  <img
                    src={form.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-black">
                    +
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#303030] text-xs font-medium">
                    {form.profilePhoto
                      ? "Change photo"
                      : "Upload photo"}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        uploadImage(
                          e,
                          "profilePhoto"
                        )
                      }
                    />
                  </label>

                  {form.profilePhoto && (
                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          "profilePhoto"
                        )
                      }
                      className="px-3 py-2.5 rounded-lg text-xs text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-gray-500 mt-2 leading-4">
                  Recommended: square image,
                  800 × 800px or higher.
                  Maximum 5MB.
                </p>
              </div>
            </div>
          </Card>

          {/* CONTACT */}

          <Card
            dark={dark}
            title="Contact information"
            description="All contact fields are optional."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Personal email"
                type="email"
                value={form.personalEmail}
                placeholder="personal@email.com"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "personalEmail",
                    value
                  )
                }
              />

              <Field
                label="Official email"
                type="email"
                value={form.officialEmail}
                placeholder="name@company.com"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "officialEmail",
                    value
                  )
                }
              />

              <Field
                label="Personal phone"
                type="tel"
                value={form.personalPhone}
                placeholder="+234 801 234 5678"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "personalPhone",
                    value
                  )
                }
              />

              <Field
                label="Official phone"
                type="tel"
                value={form.officialPhone}
                placeholder="+234 801 234 5678"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "officialPhone",
                    value
                  )
                }
              />
            </div>

            <div className="mt-4">
              <Field
                label="Address"
                value={form.address}
                placeholder="Your address or location"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "address",
                    value
                  )
                }
              />

              <p className="text-[11px] text-gray-500 mt-2">
                Visitors will be able to tap the
                address to open it in Maps.
              </p>
            </div>
          </Card>

          {/* LINKS */}

          <Card
            dark={dark}
            title="Links & socials"
            description="Add only the platforms you want displayed."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Website"
                value={form.website}
                placeholder="https://yourwebsite.com"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "website",
                    value
                  )
                }
              />

              <Field
                label="LinkedIn"
                value={form.linkedin}
                placeholder="LinkedIn profile"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "linkedin",
                    value
                  )
                }
              />

              <Field
                label="Instagram"
                value={form.instagram}
                placeholder="@username"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "instagram",
                    value
                  )
                }
              />

              <Field
                label="Twitter / X"
                value={form.twitter}
                placeholder="@username or link"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "twitter",
                    value
                  )
                }
              />

              <Field
                label="Facebook"
                value={form.facebook}
                placeholder="Facebook profile/page"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "facebook",
                    value
                  )
                }
              />

              <Field
                label="WhatsApp"
                value={form.whatsapp}
                placeholder="+234 801 234 5678"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "whatsapp",
                    value
                  )
                }
              />

              <Field
                label="Linktree"
                value={form.linktree}
                placeholder="https://linktr.ee/..."
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "linktree",
                    value
                  )
                }
              />

              <Field
                label="Other link 1"
                value={form.customLink1}
                placeholder="Add another link"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "customLink1",
                    value
                  )
                }
              />

              <Field
                label="Other link 2"
                value={form.customLink2}
                placeholder="Add another link"
                dark={dark}
                onChange={(value) =>
                  updateField(
                    "customLink2",
                    value
                  )
                }
              />
            </div>
          </Card>

          {/* PORTFOLIO */}

          <Card
            dark={dark}
            title="Portfolio / CV"
            description="Visitors can eventually preview and download this document."
          >
            {!portfolio ? (
              <label
                className={`h-28 rounded-2xl border border-dashed flex items-center justify-center gap-4 cursor-pointer ${
                  dark
                    ? "border-[#303030] bg-[#151515]"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-black"
                  style={{
                    backgroundColor:
                      form.accentColor,
                  }}
                >
                  📄
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Upload portfolio
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
                    PDF, DOC or DOCX · Maximum
                    15MB
                  </p>
                </div>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={uploadPortfolio}
                />
              </label>
            ) : (
              <div
                className={`min-h-20 rounded-2xl border px-4 py-3 flex items-center gap-3 ${
                  dark
                    ? "bg-[#151515] border-[#292929]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-black"
                  style={{
                    backgroundColor:
                      form.accentColor,
                  }}
                >
                  📄
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {portfolio.name}
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
                    {formatSize(
                      portfolio.size
                    )}
                  </p>
                </div>

                <label className="cursor-pointer text-xs px-3 py-2 rounded-lg border border-[#333]">
                  Change

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={uploadPortfolio}
                  />
                </label>

                <button
                  type="button"
                  onClick={removePortfolio}
                  className="text-xs text-red-400"
                >
                  Remove
                </button>
              </div>
            )}
          </Card>

          {/* WORK IMAGES */}

          <Card
            dark={dark}
            title="Work images"
            description="Show visitors a few examples of your work."
          >
            <div className="flex flex-wrap items-center gap-2.5">
              {workImages.map(
                (image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden shrink-0 border border-[#292929]"
                  >
                    <img
                      src={image.data}
                      alt={`Work ${
                        index + 1
                      }`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeWorkImage(
                          index
                        )
                      }
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )
              )}

              {workImages.length <
                MAX_WORK_IMAGES && (
                <label
                  className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl border border-dashed flex flex-col items-center justify-center cursor-pointer ${
                    dark
                      ? "border-[#333] bg-[#151515]"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <span
                    className="text-xl leading-none"
                    style={{
                      color:
                        form.accentColor,
                    }}
                  >
                    +
                  </span>

                  <span className="text-[9px] text-gray-500 mt-1">
                    Add
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={
                      uploadWorkImages
                    }
                  />
                </label>
              )}
            </div>

            <div
              className={`mt-4 rounded-xl px-4 py-3 text-[11px] leading-5 ${
                dark
                  ? "bg-[#151515] text-gray-500"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              Recommended: 1200 × 1200px or
              higher. JPG, PNG or WEBP. Maximum
              5MB each. Up to 5 images.
            </div>
          </Card>

          {/* APPEARANCE */}

          <Card
            dark={dark}
            title="Profile appearance"
            description="Control the look of your public profile."
          >
            {/* MODE */}

            <div>
              <p className="text-sm font-medium">
                Profile mode
              </p>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "profileMode",
                      "dark"
                    )
                  }
                  className={`p-3 rounded-2xl border text-left ${
                    form.profileMode ===
                    "dark"
                      ? "border-[#C09018]"
                      : dark
                      ? "border-[#292929]"
                      : "border-gray-300"
                  }`}
                >
                  <div className="h-12 rounded-xl bg-[#080808] border border-[#292929]" />

                  <p className="text-xs font-medium mt-3">
                    Dark
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "profileMode",
                      "light"
                    )
                  }
                  className={`p-3 rounded-2xl border text-left ${
                    form.profileMode ===
                    "light"
                      ? "border-[#C09018]"
                      : dark
                      ? "border-[#292929]"
                      : "border-gray-300"
                  }`}
                >
                  <div className="h-12 rounded-xl bg-white border border-gray-300" />

                  <p className="text-xs font-medium mt-3">
                    Light
                  </p>
                </button>
              </div>
            </div>

            {/* COLOUR */}

            <div className="mt-7">
              <p className="text-sm font-medium">
                Accent colour
              </p>

              <p className="text-[11px] text-gray-500 mt-1">
                Choose the colour used for
                buttons, highlights and links.
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      updateField(
                        "accentColor",
                        color
                      )
                    }
                    className={`w-9 h-9 rounded-full transition ${
                      form.accentColor ===
                      color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#111] scale-110"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        color,
                    }}
                    aria-label={`Choose ${color}`}
                  />
                ))}

                <label
                  className="relative w-9 h-9 rounded-full border border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden"
                  title="Custom colour"
                >
                  <input
                    type="color"
                    value={
                      form.accentColor
                    }
                    onChange={(e) =>
                      updateField(
                        "accentColor",
                        e.target.value
                      )
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <span className="text-sm">
                    +
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor:
                      form.accentColor,
                  }}
                />

                <span className="text-xs text-gray-500 uppercase">
                  {form.accentColor}
                </span>
              </div>
            </div>

            {/* COVER */}

            <ImageUploadBox
              title="Cover image"
              description="The wide image at the top of your public profile."
              value={form.coverImage}
              dark={dark}
              accent={form.accentColor}
              onUpload={(e) =>
                uploadImage(
                  e,
                  "coverImage"
                )
              }
              onRemove={() =>
                removeImage(
                  "coverImage"
                )
              }
            />

            {/* BACKGROUND */}

            <ImageUploadBox
              title="Background image"
              description="Optional image behind your public profile."
              value={form.backgroundImage}
              dark={dark}
              accent={form.accentColor}
              onUpload={(e) =>
                uploadImage(
                  e,
                  "backgroundImage"
                )
              }
              onRemove={() =>
                removeImage(
                  "backgroundImage"
                )
              }
            />
          </Card>

          {/* SAVE */}

          <div
            className={`rounded-3xl border p-5 sm:p-6 ${
              dark
                ? "bg-[#111] border-[#222]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  Ready to continue?
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  You can change these details
                  later.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={saveProfile}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-black disabled:opacity-50"
                style={{
                  backgroundColor:
                    form.accentColor,
                }}
              >
                {saving
                  ? "Saving..."
                  : "Save & Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* CARD */

function Card({
  dark,
  title,
  description,
  children,
}) {
  return (
    <section
      className={`rounded-3xl border p-5 sm:p-7 ${
        dark
          ? "bg-[#111] border-[#222]"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-semibold">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/* FIELD */

function Field({
  label,
  value,
  placeholder,
  onChange,
  dark,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-medium">
        {label}

        {required && (
          <span className="text-red-400 ml-1">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`w-full mt-2 h-12 px-4 rounded-xl text-sm outline-none ${
          dark
            ? "bg-[#181818] border border-[#292929] text-white placeholder:text-gray-700"
            : "bg-white border border-gray-300 text-black placeholder:text-gray-400"
        }`}
      />
    </div>
  );
}

/* IMAGE UPLOAD */

function ImageUploadBox({
  title,
  description,
  value,
  dark,
  accent,
  onUpload,
  onRemove,
}) {
  return (
    <div className="mt-7">
      <div className="mb-3">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="text-[11px] text-gray-500 mt-1">
          {description}
        </p>
      </div>

      <div
        className={`rounded-2xl border overflow-hidden ${
          dark
            ? "border-[#292929] bg-[#151515]"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        {value ? (
          <div className="flex items-center gap-3 p-3">
            <img
              src={value}
              alt={title}
              className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg object-cover shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">
                Image selected
              </p>

              <p className="text-[10px] text-gray-500 mt-1">
                Ready to use on your profile
              </p>
            </div>

            <label className="cursor-pointer px-3 py-2 rounded-lg border border-[#333] text-[11px] shrink-0">
              Change

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUpload}
              />
            </label>

            <button
              type="button"
              onClick={onRemove}
              className="text-[11px] text-red-400 shrink-0"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="min-h-[92px] flex items-center gap-4 px-4 cursor-pointer">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-black shrink-0"
              style={{
                backgroundColor:
                  accent,
              }}
            >
              +
            </div>

            <div>
              <p className="text-sm font-medium">
                Upload {title}
              </p>

              <p className="text-[11px] text-gray-500 mt-1">
                JPG, PNG or WEBP · Maximum 5MB
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
}