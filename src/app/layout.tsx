import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/settings";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SakuraParticles } from "@/components/effects/SakuraParticles";
import { PageBackground } from "@/components/effects/BackgroundBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const site = getSiteSettings();

export const metadata: Metadata = {
  title: `${site.title} - ${site.subtitle}`,
  description: site.description,
  keywords: siteConfig.keywords,
  icons: {
    icon: siteConfig.profile.avatar,
    shortcut: siteConfig.profile.avatar,
    apple: siteConfig.profile.avatar,
  },
};

interface LayoutProps<T extends string> {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* 在首帧绘制前同步主题，消除暗色用户的亮色闪烁（混合态怪色块的根源之一） */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme-mode')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var h=document.documentElement;if(d)h.classList.add('dark');var hue=localStorage.getItem('theme-hue');if(hue)h.style.setProperty('--hue',hue);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {/* Background */}
          <PageBackground />

          {/* Sakura particles */}
          <SakuraParticles />

          {/* Main content */}
          <Navbar />
          <main className="flex-1 w-full max-w-[100rem] mx-auto px-4 py-4">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
