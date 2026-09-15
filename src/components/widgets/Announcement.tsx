"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Announcement() {
  const [visible, setVisible] = useState(true);
  const { announcement } = siteConfig;

  if (!visible) return null;

  return (
    <div className="card-base card-padding" style={{ borderColor: "var(--primary)" }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-2">{announcement.title}</h4>
          <p className="text-sm text-[var(--muted)] mb-2">{announcement.content}</p>
          {announcement.link.enable && (
            <Link
              href={announcement.link.url}
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--primary)" }}
            >
              {announcement.link.text}
            </Link>
          )}
        </div>
        {announcement.closable && (
          <button
            onClick={() => setVisible(false)}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors text-lg leading-none"
            title="关闭"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
