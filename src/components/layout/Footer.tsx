import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/settings";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const site = getSiteSettings();

  return (
    <footer className="border-t py-8 mt-8" style={{ borderColor: "var(--card-border)" }}>
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="flex flex-col items-center gap-3 text-sm text-[var(--muted)]">
          <p>© {currentYear} {site.title} · All Rights Reserved</p>
          <p>Powered by Astro & Firefly | Theme Firefly</p>
          <div className="flex items-center gap-3">
            <a href="/rss.xml" className="hover:text-[var(--primary)] transition-colors">RSS</a>
            <span style={{ color: "var(--muted-foreground)" }}>|</span>
            <a href="/sitemap.xml" className="hover:text-[var(--primary)] transition-colors">Sitemap</a>
          </div>
          {siteConfig.footer.icp && (
            <p>
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--primary)] transition-colors"
              >
                {siteConfig.footer.icp}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
