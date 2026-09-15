import { siteConfig } from "@/lib/site-config";

export function SiteInfo() {
  return (
    <div className="card-base card-padding">
      <h4 className="font-bold text-sm mb-3">站点信息</h4>
      <div className="space-y-2 text-xs text-[var(--muted)]">
        <div className="flex justify-between">
          <span>构建平台</span>
          <span>BT Server</span>
        </div>
        <div className="flex justify-between">
          <span>博客版本</span>
          <a
            href="https://github.com/CuteLeaf/Firefly"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "var(--primary)" }}
          >
            Firefly v6.13.1
          </a>
        </div>
        <div className="flex justify-between">
          <span>文章许可</span>
          <a
            href={siteConfig.license.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {siteConfig.license.name}
          </a>
        </div>
        <div className="flex justify-between">
          <span>站点域名</span>
          <span>{siteConfig.siteUrl.replace("https://", "")}</span>
        </div>
        <hr style={{ borderColor: "var(--card-border)" }} />
        <div className="flex justify-between">
          <span>Firefly</span>
          <span>v6.13.1</span>
        </div>
        <div className="flex justify-between">
          <span>Astro</span>
          <span>v7.0.2</span>
        </div>
        <div className="flex justify-between">
          <span>Node</span>
          <span>v22.22.3</span>
        </div>
        <div className="flex justify-between">
          <span>pnpm</span>
          <span>v9.14.4</span>
        </div>
        <hr style={{ borderColor: "var(--card-border)" }} />
        <div className="flex justify-between">
          <span>构建时间</span>
          <span>2026年7月9日</span>
        </div>
        <div className="flex justify-between">
          <span>系统信息</span>
          <span>Linux / x86_64</span>
        </div>
      </div>
    </div>
  );
}
