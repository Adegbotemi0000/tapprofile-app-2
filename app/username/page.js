"use client";

import { useEffect, useState } from "react";

export default function PublicProfilePage() {
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [workImages, setWorkImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    try {
      const savedProfile =
        localStorage.getItem("tapprofile_profile");

      const savedPortfolioName =
        localStorage.getItem("tapprofile_portfolio_name");

      const savedPortfolioSize =
        localStorage.getItem("tapprofile_portfolio_size");

      const savedWorkImages =
        localStorage.getItem("tapprofile_work_images");

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      if (savedPortfolioName) {
        setPortfolio({
          name: savedPortfolioName,
          size: Number(savedPortfolioSize || 0),
        });
      }

      if (savedWorkImages) {
        setWorkImages(JSON.parse(savedWorkImages));
      }
    } catch (error) {
      console.error("Unable to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-[#C09018] animate-spin mx-auto" />

          <p className="text-sm text-gray-500 mt-4">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mx-auto text-xl font-semibold">
            T
          </div>

          <h1 className="text-2xl font-semibold text-[#111] mt-6">
            Profile not found
          </h1>

          <p className="text-sm text-gray-500 mt-2 leading-6">
            This TapProfile does not exist or has not been
            set up yet.
          </p>
        </div>
      </main>
    );
  }

  const accent = profile.accentColor || "#C09018";

  const fullDisplayName = [
    profile.prefix,
    profile.fullName,
    profile.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  const displayName =
    fullDisplayName || "TapProfile User";

  const profileMode = profile.profileMode || "light";

  const isDark = profileMode === "dark";

  const pageBackground = isDark
    ? "#090909"
    : "#f6f6f4";

  const cardBackground = isDark
    ? "#111111"
    : "#ffffff";

  const primaryText = isDark
    ? "#ffffff"
    : "#111111";

  const secondaryText = isDark
    ? "#999999"
    : "#666666";

  const borderColor = isDark
    ? "#242424"
    : "#e7e7e3";

  function formatSize(bytes) {
    if (!bytes) return "";

    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.round(bytes / 1024)} KB`;
  }

  function openMaps() {
    if (!profile.address) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      profile.address
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function normalizeUrl(url) {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `https://${url}`;
  }

  function openWhatsApp() {
    if (!profile.whatsapp) return;

    const phone = profile.whatsapp.replace(/\D/g, "");

    window.open(
      `https://wa.me/${phone}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function escapeVCardValue(value) {
    if (!value) return "";

    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  }

  async function imageToBase64(imageSource) {
    if (!imageSource) return null;

    try {
      if (imageSource.startsWith("data:")) {
        const parts = imageSource.split(",");

        if (parts.length < 2) {
          return null;
        }

        const header = parts[0];
        const data = parts[1];

        const mimeMatch = header.match(
          /data:([^;]+)/
        );

        return {
          mime: mimeMatch
            ? mimeMatch[1]
            : "image/jpeg",
          base64: data,
        };
      }

      const response = await fetch(imageSource);

      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();

      const arrayBuffer = await blob.arrayBuffer();

      const bytes = new Uint8Array(arrayBuffer);

      let binary = "";

      const chunkSize = 0x8000;

      for (
        let i = 0;
        i < bytes.length;
        i += chunkSize
      ) {
        binary += String.fromCharCode(
          ...bytes.subarray(
            i,
            Math.min(i + chunkSize, bytes.length)
          )
        );
      }

      return {
        mime: blob.type || "image/jpeg",
        base64: btoa(binary),
      };
    } catch (error) {
      console.error(
        "Unable to convert profile photo:",
        error
      );

      return null;
    }
  }

  function getPhotoType(mime) {
    if (!mime) return "JPEG";

    const type = mime.toLowerCase();

    if (type.includes("png")) {
      return "PNG";
    }

    if (type.includes("gif")) {
      return "GIF";
    }

    if (type.includes("webp")) {
      return "WEBP";
    }

    return "JPEG";
  }

  async function saveContact() {
    if (savingContact) return;

    setSavingContact(true);

    try {
      const photo = await imageToBase64(
        profile.profilePhoto
      );

      const lines = [];

      lines.push("BEGIN:VCARD");
      lines.push("VERSION:3.0");

      lines.push(
        `FN:${escapeVCardValue(displayName)}`
      );

      if (profile.fullName) {
        const nameParts =
          profile.fullName
            .trim()
            .split(/\s+/);

        const firstName =
          nameParts.length > 0
            ? nameParts[0]
            : "";

        const lastName =
          nameParts.length > 1
            ? nameParts
                .slice(1)
                .join(" ")
            : "";

        lines.push(
          `N:${escapeVCardValue(
            lastName
          )};${escapeVCardValue(
            firstName
          )};;;`
        );
      }

      if (profile.company) {
        lines.push(
          `ORG:${escapeVCardValue(
            profile.company
          )}`
        );
      }

      if (profile.title) {
        lines.push(
          `TITLE:${escapeVCardValue(
            profile.title
          )}`
        );
      }

      /*
       * PERSONAL PHONE
       */

      if (profile.personalPhone) {
        lines.push(
          `TEL;TYPE=CELL:${escapeVCardValue(
            profile.personalPhone
          )}`
        );
      }

      /*
       * OFFICIAL / WORK PHONE
       */

      if (profile.officialPhone) {
        lines.push(
          `TEL;TYPE=WORK,VOICE:${escapeVCardValue(
            profile.officialPhone
          )}`
        );
      }

      /*
       * WHATSAPP
       */

      if (profile.whatsapp) {
        lines.push(
          `TEL;TYPE=OTHER:${escapeVCardValue(
            profile.whatsapp
          )}`
        );

        lines.push(
          `X-WHATSAPP:${escapeVCardValue(
            profile.whatsapp
          )}`
        );
      }

      /*
       * PERSONAL EMAIL
       */

      if (profile.personalEmail) {
        lines.push(
          `EMAIL;TYPE=HOME:${escapeVCardValue(
            profile.personalEmail
          )}`
        );
      }

      /*
       * OFFICIAL / WORK EMAIL
       */

      if (profile.officialEmail) {
        lines.push(
          `EMAIL;TYPE=WORK:${escapeVCardValue(
            profile.officialEmail
          )}`
        );
      }

      /*
       * ADDRESS
       */

      if (profile.address) {
        lines.push(
          `ADR;TYPE=WORK:;;${escapeVCardValue(
            profile.address
          )};;;;`
        );
      }

      /*
       * WEBSITE
       */

      if (profile.website) {
        lines.push(
          `URL:${escapeVCardValue(
            normalizeUrl(profile.website)
          )}`
        );
      }

      /*
       * PROFILE PHOTO
       *
       * Embedded directly inside the vCard.
       */

      if (photo) {
        lines.push(
          `PHOTO;ENCODING=b;TYPE=${getPhotoType(
            photo.mime
          )}:${photo.base64}`
        );
      }

      lines.push("END:VCARD");

      const contact = lines.join("\r\n");

      const blob = new Blob(
        [contact],
        {
          type: "text/vcard;charset=utf-8",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `${displayName
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase()}.vcf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error(
        "Unable to save contact:",
        error
      );

      alert(
        "Unable to save contact. Please try again."
      );
    } finally {
      setSavingContact(false);
    }
  }

  async function shareProfile() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: displayName,
          text: `View ${displayName}'s TapProfile`,
          url,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      alert("Profile link copied.");
    } catch {
      alert(url);
    }
  }

  const socialLinks = [
    {
      label: "Website",
      value: profile.website,
      icon: "↗",
      href: normalizeUrl(profile.website),
    },
    {
      label: "LinkedIn",
      value: profile.linkedin,
      icon: "in",
      href: normalizeUrl(profile.linkedin),
    },
    {
      label: "Instagram",
      value: profile.instagram,
      icon: "◎",
      href: normalizeUrl(profile.instagram),
    },
    {
      label: "X",
      value: profile.twitter,
      icon: "𝕏",
      href: normalizeUrl(profile.twitter),
    },
    {
      label: "Facebook",
      value: profile.facebook,
      icon: "f",
      href: normalizeUrl(profile.facebook),
    },
    {
      label: "Linktree",
      value: profile.linktree,
      icon: "↗",
      href: normalizeUrl(profile.linktree),
    },
    {
      label: "Other",
      value: profile.customLink1,
      icon: "↗",
      href: normalizeUrl(profile.customLink1),
    },
    {
      label: "Other",
      value: profile.customLink2,
      icon: "↗",
      href: normalizeUrl(profile.customLink2),
    },
  ].filter((item) => item.value);

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: pageBackground,
        color: primaryText,
      }}
    >
      <div className="w-full max-w-[680px] mx-auto min-h-screen">
        {/* COVER */}

        <section
          className="relative h-[210px] sm:h-[250px] overflow-hidden"
          style={{
            backgroundColor: isDark
              ? "#151515"
              : "#e9e9e5",
          }}
        >
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
                background: isDark
                  ? `linear-gradient(135deg, #151515, ${accent}55, #080808)`
                  : `linear-gradient(135deg, #eeeeea, ${accent}30, #ffffff)`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-black/10" />

          <button
            type="button"
            onClick={shareProfile}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-lg"
            aria-label="Share profile"
          >
            ↗
          </button>
        </section>

        {/* PROFILE INTRO */}

        <section
          className="relative px-5 sm:px-8"
          style={{
            backgroundColor: cardBackground,
          }}
        >
          <div className="max-w-[580px] mx-auto">
            {/* PROFILE PHOTO */}

            <div className="-mt-16 relative z-10">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[5px] mx-auto shadow-xl"
                style={{
                  borderColor: cardBackground,
                  backgroundColor: accent,
                }}
              >
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-black">
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* NAME */}

            <div className="text-center pt-5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {displayName}
              </h1>

              {profile.title && (
                <p
                  className="text-sm sm:text-base mt-2 font-medium"
                  style={{
                    color: accent,
                  }}
                >
                  {profile.title}
                </p>
              )}

              {profile.company && (
                <p
                  className="text-sm mt-1"
                  style={{
                    color: secondaryText,
                  }}
                >
                  {profile.company}
                </p>
              )}
            </div>

            {/* PRIMARY ACTIONS */}

            <div className="grid grid-cols-2 gap-3 mt-7">
              <button
                type="button"
                onClick={saveContact}
                disabled={savingContact}
                className="h-12 rounded-xl text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60"
                style={{
                  backgroundColor: accent,
                  color: "#000",
                }}
              >
                {savingContact
                  ? "Saving..."
                  : "Save Contact"}
              </button>

              <button
                type="button"
                onClick={shareProfile}
                className="h-12 rounded-xl text-sm font-semibold border transition active:scale-[0.98]"
                style={{
                  borderColor: accent,
                  color: accent,
                }}
              >
                Share Profile
              </button>
            </div>

            {/* BIO */}

            {profile.bio && (
              <section className="pt-10">
                <SectionTitle
                  title="About"
                  accent={accent}
                  color={primaryText}
                />

                <p
                  className="text-sm sm:text-[15px] leading-7 mt-4"
                  style={{
                    color: secondaryText,
                  }}
                >
                  {profile.bio}
                </p>
              </section>
            )}

            {/* CONTACT */}

            {(profile.personalEmail ||
              profile.officialEmail ||
              profile.personalPhone ||
              profile.officialPhone ||
              profile.whatsapp ||
              profile.address) && (
              <section className="pt-10">
                <SectionTitle
                  title="Contact"
                  accent={accent}
                  color={primaryText}
                />

                <div className="mt-4 space-y-2.5">
                  {profile.personalEmail && (
                    <ContactItem
                      icon="✉"
                      label="Personal email"
                      value={profile.personalEmail}
                      href={`mailto:${profile.personalEmail}`}
                      accent={accent}
                      borderColor={borderColor}
                      background={
                        isDark
                          ? "#171717"
                          : "#fafafa"
                      }
                      color={primaryText}
                      secondary={secondaryText}
                    />
                  )}

                  {profile.officialEmail && (
                    <ContactItem
                      icon="✉"
                      label="Official email"
                      value={profile.officialEmail}
                      href={`mailto:${profile.officialEmail}`}
                      accent={accent}
                      borderColor={borderColor}
                      background={
                        isDark
                          ? "#171717"
                          : "#fafafa"
                      }
                      color={primaryText}
                      secondary={secondaryText}
                    />
                  )}

                  {profile.personalPhone && (
                    <ContactItem
                      icon="☎"
                      label="Personal phone"
                      value={profile.personalPhone}
                      href={`tel:${profile.personalPhone}`}
                      accent={accent}
                      borderColor={borderColor}
                      background={
                        isDark
                          ? "#171717"
                          : "#fafafa"
                      }
                      color={primaryText}
                      secondary={secondaryText}
                    />
                  )}

                  {profile.officialPhone && (
                    <ContactItem
                      icon="☎"
                      label="Official phone"
                      value={profile.officialPhone}
                      href={`tel:${profile.officialPhone}`}
                      accent={accent}
                      borderColor={borderColor}
                      background={
                        isDark
                          ? "#171717"
                          : "#fafafa"
                      }
                      color={primaryText}
                      secondary={secondaryText}
                    />
                  )}

                  {profile.whatsapp && (
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="w-full text-left"
                    >
                      <ContactItem
                        icon="◉"
                        label="WhatsApp"
                        value={profile.whatsapp}
                        accent={accent}
                        borderColor={borderColor}
                        background={
                          isDark
                            ? "#171717"
                            : "#fafafa"
                        }
                        color={primaryText}
                        secondary={secondaryText}
                      />
                    </button>
                  )}

                  {profile.address && (
                    <button
                      type="button"
                      onClick={openMaps}
                      className="w-full text-left"
                    >
                      <ContactItem
                        icon="⌖"
                        label="Location"
                        value={profile.address}
                        accent={accent}
                        borderColor={borderColor}
                        background={
                          isDark
                            ? "#171717"
                            : "#fafafa"
                        }
                        color={primaryText}
                        secondary={secondaryText}
                      />
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* LINKS */}

            {socialLinks.length > 0 && (
              <section className="pt-10">
                <SectionTitle
                  title="Links"
                  accent={accent}
                  color={primaryText}
                />

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {socialLinks.map(
                    (link, index) => (
                      <a
                        key={`${link.label}-${index}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[62px] rounded-xl border px-4 flex items-center gap-3 transition hover:translate-y-[-1px]"
                        style={{
                          borderColor,
                          backgroundColor:
                            isDark
                              ? "#151515"
                              : "#ffffff",
                        }}
                      >
                        <span
                          className="w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm"
                          style={{
                            backgroundColor: `${accent}18`,
                            color: accent,
                          }}
                        >
                          {link.icon}
                        </span>

                        <span
                          className="text-sm font-medium"
                          style={{
                            color: primaryText,
                          }}
                        >
                          {link.label}
                        </span>
                      </a>
                    )
                  )}
                </div>
              </section>
            )}

            {/* WORK */}

            {workImages.length > 0 && (
              <section className="pt-10">
                <SectionTitle
                  title="Selected work"
                  accent={accent}
                  color={primaryText}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
                  {workImages.map(
                    (image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="aspect-square rounded-xl overflow-hidden"
                        style={{
                          backgroundColor:
                            isDark
                              ? "#171717"
                              : "#eeeeeb",
                        }}
                      >
                        <img
                          src={image.data}
                          alt={`Work ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* PORTFOLIO */}

            {portfolio && (
              <section className="pt-10">
                <SectionTitle
                  title="Portfolio"
                  accent={accent}
                  color={primaryText}
                />

                <div
                  className="mt-4 rounded-2xl border p-4 sm:p-5 flex items-center gap-4"
                  style={{
                    borderColor,
                    backgroundColor:
                      isDark
                        ? "#151515"
                        : "#ffffff",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
                    style={{
                      backgroundColor: `${accent}18`,
                      color: accent,
                    }}
                  >
                    ▣
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{
                        color: primaryText,
                      }}
                    >
                      {portfolio.name}
                    </p>

                    <p
                      className="text-xs mt-1"
                      style={{
                        color: secondaryText,
                      }}
                    >
                      {formatSize(
                        portfolio.size
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold opacity-60"
                    style={{
                      backgroundColor: accent,
                      color: "#000",
                    }}
                  >
                    View
                  </button>
                </div>

                <p
                  className="text-[11px] mt-2"
                  style={{
                    color: secondaryText,
                  }}
                >
                  Portfolio preview and download
                  will be available once document
                  storage is connected.
                </p>
              </section>
            )}

            {/* WEBSITE */}

            {profile.website && (
              <section className="pt-10">
                <a
                  href={normalizeUrl(
                    profile.website
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border p-5 text-center transition hover:translate-y-[-1px]"
                  style={{
                    borderColor: accent,
                    backgroundColor:
                      isDark
                        ? "#151515"
                        : "#ffffff",
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: accent,
                    }}
                  >
                    Visit Website
                  </p>

                  <p
                    className="text-xs mt-1 truncate"
                    style={{
                      color: secondaryText,
                    }}
                  >
                    {profile.website}
                  </p>
                </a>
              </section>
            )}

            {/* FOOTER */}

            <footer className="py-12 text-center">
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: accent,
                    color: "#000",
                  }}
                >
                  T
                </div>

                <span
                  className="text-xs font-semibold tracking-[0.16em]"
                  style={{
                    color: primaryText,
                  }}
                >
                  TAP PROFILE
                </span>
              </div>

              <p
                className="text-[11px] mt-2"
                style={{
                  color: secondaryText,
                }}
              >
                A digital identity that stays with you.
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionTitle({
  title,
  accent,
  color,
}) {
  return (
    <div className="flex items-center gap-3">
      <h2
        className="text-base font-semibold"
        style={{
          color,
        }}
      >
        {title}
      </h2>

      <div
        className="h-px flex-1"
        style={{
          backgroundColor: `${accent}35`,
        }}
      />
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
  accent,
  borderColor,
  background,
  color,
  secondary,
}) {
  const content = (
    <div
      className="rounded-xl border p-3.5 flex items-center gap-3 transition hover:translate-y-[-1px]"
      style={{
        borderColor,
        backgroundColor: background,
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: `${accent}18`,
          color: accent,
        }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] uppercase tracking-[0.12em]"
          style={{
            color: secondary,
          }}
        >
          {label}
        </p>

        <p
          className="text-sm mt-1 truncate"
          style={{
            color,
          }}
        >
          {value}
        </p>
      </div>

      <span
        className="text-sm shrink-0"
        style={{
          color: secondary,
        }}
      >
        →
      </span>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href}>
      {content}
    </a>
  );
}