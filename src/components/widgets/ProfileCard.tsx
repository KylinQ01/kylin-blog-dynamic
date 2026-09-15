import { siteConfig } from "@/lib/site-config";
import Image from "next/image";

export function ProfileCard() {
  const { profile } = siteConfig;

  return (
    <div className="card-base card-padding text-center">
      {/* Avatar */}
      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden profile-avatar relative">
        <Image
          src={profile.avatar}
          alt={profile.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Name */}
      <h3 className="font-bold text-lg mb-1">{profile.name}</h3>

      {/* Bio */}
      <p className="text-sm text-[var(--muted)] mb-4">{profile.bio}</p>

      {/* Links - 去掉 QQ */}
      <div className="flex items-center justify-center gap-3">
        {profile.links.filter(link => link.name !== "qq").map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110 hover:shadow-md"
            style={{ backgroundColor: link.color + "20", color: link.color }}
            title={link.name}
          >
            {link.name === "GitHub" && (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            {link.name === "抖音" && (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7 6.34 6.34 0 009.49 22a6.34 6.34 0 006.34-6.34V9.01a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.44z"/>
              </svg>
            )}
            {link.name === "RSS" && (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 012.18 2.18C8.36 19 7.38 20 6.18 20A2.18 2.18 0 014 17.82a2.18 2.18 0 012.18-2.18M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27zm0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93z"/>
              </svg>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
