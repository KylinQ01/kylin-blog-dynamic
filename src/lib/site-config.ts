export const siteConfig = {
  title: "Kylin",
  subtitle: "怀化佳木所失，峥嵘苍翠犹立",
  description:
    "Firefly 是一款基于 Astro 框架和 Fuwari 模板开发的清新美观且现代化个人博客主题模板，专为技术爱好者和内容创作者设计。",
  keywords: ["Firefly", "Fuwari", "Astro", "ACGN", "博客", "技术博客", "静态博客"],
  siteUrl: "https://kylinqaq.xyz",
  siteStartDate: "2026-06-24",
  timezone: "Asia/Shanghai",
  lang: "zh_CN",
  themeColor: {
    hue: 165,
    fixed: false,
    defaultMode: "system",
  },
  pageWidth: 100,
  card: {
    border: true,
    followTheme: false,
  },
  navBar: {
    title: "Kylin",
    menuAlign: "center",
    followTheme: false,
    stickyNavbar: true,
    logo: "/_astro/avatar.jpg",
  },
  profile: {
    name: "Kylin",
    bio: "一只会写代码的Kylin 🍀",
    avatar: "/_astro/avatar.jpg",
    links: [
      { name: "qq", icon: "fa7-brands:qq", url: "https://qm.qq.com/cgi-bin/qm/qr?k=2686536946", color: "#12B7F5" },
      { name: "GitHub", icon: "fa7-brands:github", url: "https://github.com/KylinQ01", color: "#333333" },
      { name: "抖音", icon: "simple-icons:tiktok", url: "https://www.douyin.com/user/self", color: "#fe2c55" },
      { name: "RSS", icon: "fa7-solid:rss", url: "/rss.xml", color: "#f26522" },
    ],
  },
  license: {
    enable: true,
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  announcement: {
    title: "公告",
    content: "欢迎来到我的博客！这是一则示例公告。",
    closable: true,
    link: {
      enable: true,
      text: "了解更多",
      url: "/about",
      external: false,
    },
  },
  musicPlayer: {
    showInNavbar: true,
    mode: "local",
    volume: 0.7,
    playMode: "list",
    showLyrics: true,
    playlist: [
      { name: "使一颗心免于哀伤", artist: "哼唱", url: "/assets/music/使一颗心免于哀伤-哼唱.mp3", cover: "/assets/music/cover/109951169585655912.webp" },
    ],
  },
  footer: {
    enable: false,
    icp: "粤ICP备2026087658号",
  },
  pages: {
    friends: true,
    sponsor: true,
    guestbook: true,
    moments: true,
    bangumi: true,
    gallery: true,
    anime: true,
    play: true,
    type: true,
  },
  postListLayout: {
    defaultMode: "list",
    mobileDefaultMode: "list",
    showTags: true,
    descriptionLines: 2,
    allowSwitch: true,
  },
  pagination: {
    postsPerPage: 10,
  },
  // API configs
  bangumi: {
    userId: "1143164",
    apiUrl: "https://bgmapi.anibt.net",
  },
  anime: {
    bilibili: {
      uid: "574711676",
    },
  },
};
