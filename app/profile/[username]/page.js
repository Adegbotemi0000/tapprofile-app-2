"use client";

import { useEffect, useState } from "react";

export default function PublicProfilePage() {
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [workImages, setWorkImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("tapprofile_profile");
      const savedPortfolioName = localStorage.getItem(
        "tapprofile_portfolio_name"
      );
      const savedPortfolioSize = localStorage.getItem(
        "tapprofile_portfolio_size"
      );
      const savedWorkImages = localStorage.getItem(
        "tapprofile_work_images"
      );

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
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 rounded-full border-2 border-white/10 border-t-[#B08D3E] animate-spin mx-auto" />

          <p className="text-sm text-white/35 mt-5 tracking-wide">
            Loading profile…
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full border border-[#B08D3E]/50 text-[#D9BE7C] flex items-center justify-center mx-auto text-lg font-serif">
            ?
          </div>

          <h1 className="text-xl font-serif text-white mt-6 tracking-tight">
            Profile not found
          </h1>

          <p className="text-sm text-white/40 mt-2.5 leading-6">
            This TapProfile does not exist or has not been set up yet.
          </p>
        </div>
      </main>
    );
  }

  const accent = profile.accentColor || "#B08D3E";

  const displayName =
    [
      profile.prefix,
      profile.fullName,
      profile.suffix,
    ]
      .filter(Boolean)
      .join(" ") || "TapProfile User";

  const isDark = profile.profileMode === "dark";

  const pageBackground = isDark ? "#0B0B0B" : "#FBFAF8";
  const primaryText = isDark ? "#F5F4F1" : "#161513";
  const secondaryText = isDark ? "#93908A" : "#6E6A63";
  const borderColor = isDark ? "#232220" : "#E7E3DC";
  const hoverBackground = isDark ? "#151413" : "#F3F0EA";

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

  function formatSize(bytes) {
    if (!bytes) return "";

    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.round(bytes / 1024)} KB`;
  }

  function openMaps() {
    if (!profile.address) return;

    const url =
      `https://www.google.com/maps/search/?api=1&query=` +
      encodeURIComponent(profile.address);

    window.open(url, "_blank", "noopener,noreferrer");
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

  function saveContact() {
    const contact = `BEGIN:VCARD
VERSION:3.0
FN:${displayName}
ORG:${profile.company || ""}
TITLE:${profile.title || ""}
EMAIL:${profile.personalEmail || ""}
EMAIL;TYPE=WORK:${profile.officialEmail || ""}
TEL:${profile.personalPhone || ""}
TEL;TYPE=WORK:${profile.officialPhone || ""}
ADR:;;${profile.address || ""}
URL:${profile.website || ""}
END:VCARD`;

    const blob = new Blob([contact], {
      type: "text/vcard;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      `${displayName.replace(/\s+/g, "-").toLowerCase()}.vcf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
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

  const hasContactInfo =
    profile.personalEmail ||
    profile.officialEmail ||
    profile.personalPhone ||
    profile.officialPhone ||
    profile.whatsapp ||
    profile.address;

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: pageBackground,
      }}
    >
      {/* SLIM COVER — only appears if a cover image was actually set */}

      {profile.coverImage && (
        <div className="relative h-[120px] sm:h-[140px] w-full overflow-hidden">
          <img
            src={profile.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(180deg, rgba(11,11,11,0) 40%, #0B0B0B 100%)"
                : "linear-gradient(180deg, rgba(251,250,248,0) 40%, #FBFAF8 100%)",
            }}
          />
        </div>
      )}

      <div className="max-w-[540px] mx-auto px-6 sm:px-8">
        {/* IDENTITY */}

        <header
          className={`flex flex-col items-center text-center ${
            profile.coverImage ? "-mt-10 sm:-mt-12" : "pt-16 sm:pt-20"
          }`}
        >
          <div
            className="w-[84px] h-[84px] rounded-full overflow-hidden shrink-0"
            style={{
              boxShadow: `0 0 0 3px ${pageBackground}, 0 0 0 4.5px ${accent}80`,
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
              <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-black">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h1
            className="font-serif text-[26px] sm:text-[28px] leading-tight tracking-tight mt-5"
            style={{ color: primaryText }}
          >
            {displayName}
          </h1>

          {(profile.title || profile.company) && (
            <p className="text-[13px] mt-2" style={{ color: secondaryText }}>
              {profile.title}
              {profile.title && profile.company ? (
                <span style={{ color: accent }}> · </span>
              ) : null}
              {profile.company}
            </p>
          )}

          {profile.bio && (
            <p
              className="text-[13.5px] leading-6 mt-5 max-w-[38ch]"
              style={{ color: secondaryText }}
            >
              {profile.bio}
            </p>
          )}

          {/* ACTIONS */}

          <div className="flex items-center gap-3 mt-7 w-full max-w-[300px]">
            <button
              type="button"
              onClick={saveContact}
              className="flex-1 h-11 rounded-full text-[13px] font-semibold tracking-wide transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                backgroundColor: accent,
                color: "#0B0B0B",
              }}
            >
              Save Contact
            </button>

            <button
              type="button"
              onClick={shareProfile}
              className="flex-1 h-11 rounded-full text-[13px] font-semibold tracking-wide border transition-colors duration-150"
              style={{
                borderColor,
                color: primaryText,
              }}
            >
              Share
            </button>
          </div>
        </header>

        {/* CONTACT */}

        {hasContactInfo && (
          <Section label="Contact" accent={accent} color={secondaryText}>
            <div>
              {profile.personalEmail && (
                <ContactRow
                  icon="✉"
                  label="Personal email"
                  value={profile.personalEmail}
                  href={`mailto:${profile.personalEmail}`}
                  accent={accent}
                  borderColor={borderColor}
                  hoverBackground={hoverBackground}
                  color={primaryText}
                  secondary={secondaryText}
                />
              )}

              {profile.officialEmail && (
                <ContactRow
                  icon="✉"
                  label="Official email"
                  value={profile.officialEmail}
                  href={`mailto:${profile.officialEmail}`}
                  accent={accent}
                  borderColor={borderColor}
                  hoverBackground={hoverBackground}
                  color={primaryText}
                  secondary={secondaryText}
                />
              )}

              {profile.personalPhone && (
                <ContactRow
                  icon="☎"
                  label="Personal phone"
                  value={profile.personalPhone}
                  href={`tel:${profile.personalPhone}`}
                  accent={accent}
                  borderColor={borderColor}
                  hoverBackground={hoverBackground}
                  color={primaryText}
                  secondary={secondaryText}
                />
              )}

              {profile.officialPhone && (
                <ContactRow
                  icon="☎"
                  label="Official phone"
                  value={profile.officialPhone}
                  href={`tel:${profile.officialPhone}`}
                  accent={accent}
                  borderColor={borderColor}
                  hoverBackground={hoverBackground}
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
                  <ContactRow
                    icon="◉"
                    label="WhatsApp"
                    value={profile.whatsapp}
                    accent={accent}
                    borderColor={borderColor}
                    hoverBackground={hoverBackground}
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
                  <ContactRow
                    icon="⌖"
                    label="Location"
                    value={profile.address}
                    accent={accent}
                    borderColor={borderColor}
                    hoverBackground={hoverBackground}
                    color={primaryText}
                    secondary={secondaryText}
                    last
                  />
                </button>
              )}
            </div>
          </Section>
        )}

        {/* LINKS */}

        {socialLinks.length > 0 && (
          <Section label="Links" accent={accent} color={secondaryText}>
            <div className="grid grid-cols-2 gap-2.5">
              {socialLinks.map((link, index) => (
                <a
                  key={`${link.label}-${index}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors duration-150"
                  style={{ borderColor }}
                >
                  <span
                    className="text-[13px] font-semibold shrink-0 w-5 text-center"
                    style={{ color: accent }}
                  >
                    {link.icon}
                  </span>

                  <span
                    className="text-[13px] font-medium truncate"
                    style={{ color: primaryText }}
                  >
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* WORK */}

        {workImages.length > 0 && (
          <Section label="Selected work" accent={accent} color={secondaryText}>
            <div className="grid grid-cols-3 gap-2">
              {workImages.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className="group aspect-square rounded-lg overflow-hidden"
                  style={{ backgroundColor: hoverBackground }}
                >
                  <img
                    src={image.data}
                    alt={`Work ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* PORTFOLIO */}

        {portfolio && (
          <Section label="Portfolio" accent={accent} color={secondaryText}>
            <div
              className="rounded-xl border p-3.5 flex items-center gap-3"
              style={{ borderColor }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm"
                style={{
                  backgroundColor: `${accent}1a`,
                  color: accent,
                }}
              >
                ▣
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-medium truncate"
                  style={{ color: primaryText }}
                >
                  {portfolio.name}
                </p>

                <p className="text-[11px] mt-0.5" style={{ color: secondaryText }}>
                  {formatSize(portfolio.size)}
                </p>
              </div>

              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold opacity-60 border"
                style={{ borderColor: accent, color: accent }}
              >
                View
              </button>
            </div>
          </Section>
        )}

        {/* WEBSITE */}

        {profile.website && (
          <Section label={null} accent={accent} color={secondaryText}>
            <a
              href={normalizeUrl(profile.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border p-4 text-center transition-colors duration-150"
              style={{ borderColor: accent }}
            >
              <p className="text-[14px] font-semibold" style={{ color: accent }}>
                Visit Website
              </p>
              <p
                className="text-[11px] mt-1 truncate"
                style={{ color: secondaryText }}
              >
                {profile.website}
              </p>
            </a>
          </Section>
        )}

        <div className="h-16" />
      </div>
    </main>
  );
}

function Section({ label, accent, color, children }) {
  return (
    <section className="pt-10">
      {label && (
        <p
          className="text-[10.5px] font-semibold uppercase mb-3"
          style={{ color, letterSpacing: "0.14em" }}
        >
          {label}
        </p>
      )}
      {children}
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  accent,
  borderColor,
  hoverBackground,
  color,
  secondary,
  last,
}) {
  const content = (
    <div
      className="group flex items-center gap-3 py-3"
      style={{
        borderBottom: last ? "none" : `1px solid ${borderColor}`,
      }}
    >
      <span
        className="text-sm w-8 shrink-0 text-center"
        style={{ color: accent }}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="text-[9.5px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: secondary }}
        >
          {label}
        </p>
        <p className="text-[13.5px] mt-0.5 truncate" style={{ color }}>
          {value}
        </p>
      </div>

      <span
        className="text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ color: accent }}
      >
        →
      </span>
    </div>
  );

  if (!href) {
    return content;
  }

  return <a href={href}>{content}</a>;
}