import fs from "fs";
import path from "path";
import { siteConfig } from "./site-config";

// 可编辑的站点设置（仅开放管理后台支持修改的字段）
export interface EditableSettings {
  title: string;
  subtitle: string;
  description: string;
}

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

// 5 秒缓存，避免每次 SSR 都读盘，同时保证保存后短时间生效
const CACHE_TTL = 5_000;
let cache: EditableSettings | null = null;
let cacheTime = 0;

function readOverrides(): Partial<EditableSettings> {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return {};
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function getSiteSettings(): EditableSettings {
  if (cache && Date.now() - cacheTime < CACHE_TTL) return cache;

  const overrides = readOverrides();
  cache = {
    title: overrides.title?.trim() || siteConfig.title,
    subtitle: overrides.subtitle?.trim() || siteConfig.subtitle,
    description: overrides.description?.trim() || siteConfig.description,
  };
  cacheTime = Date.now();
  return cache;
}

export function saveSiteSettings(settings: EditableSettings) {
  const clean: EditableSettings = {
    title: settings.title.trim() || siteConfig.title,
    subtitle: settings.subtitle.trim() || siteConfig.subtitle,
    description: settings.description.trim() || siteConfig.description,
  };
  fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(clean, null, 2), "utf-8");
  cache = clean;
  cacheTime = Date.now();
}
