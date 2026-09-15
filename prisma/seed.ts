import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 开始导入种子数据...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const existingAdmin = await prisma.user.findUnique({ where: { username: "admin" } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword,
        name: "Kylin",
        role: "admin",
      },
    });
  }
  console.log("✅ 管理员账号已创建: admin / admin123");

  // Create posts
  const posts = [
    {
      slug: "about-kylin",
      title: "你好，我是 Kylin",
      description: "一个喜欢 AI 开发、也喜欢 CS 和洛克王国的小白程序员的自我介绍。",
      content: `大家好，我是 **Kylin**。

如果要用一句话介绍自己，那大概就是：**一个正在认真学习 AI 开发的小白程序员**。

我不是那种一开始就什么都会的人，反而更像是一路边学边试、边踩坑边成长的类型。最近我最感兴趣的方向就是 **AI 开发**，尤其喜欢折腾一些能真正跑起来的小项目：比如博客、自动化工具、网页功能，或者把脑子里的想法借助 AI 一点点实现出来。

对我来说，写代码最有意思的地方，不只是"把功能做出来"，更是那种从一片空白到慢慢成型的过程。虽然现在还在新手阶段，但我很喜欢这种不断探索、不断进步的感觉。

除了写代码，我平时也喜欢玩游戏。

---

## 我喜欢的东西

### AI 开发

这是我现在最想深挖的方向。

我喜欢看着一个想法从模糊变清晰，也喜欢借助 AI 帮助自己理解问题、整理思路、提高效率。对我来说，AI 不只是工具，更像是一个能一起学习、一起创造的伙伴。

### Counter-Strike

我喜欢 **CS** 这种很纯粹的竞技感。

它有节奏、有配合、有博弈，既考验反应，也考验思路。每次打的时候都能很明显感受到专注、判断和执行之间的关系，这种感觉和写代码其实挺像的：看起来是在解决眼前的问题，实际上是在训练自己如何更冷静地处理复杂情况。

### 洛克王国

如果说 CS 是紧张刺激的那一面，那 **洛克王国** 就更像是轻松、熟悉又有点情怀的那一面。

我会记录一些自己在洛克王国里的日常，也很享受慢慢收集、培养、探索的过程。它陪伴了我很多时间，也让我的博客内容多了一份轻松和生活气息。

---

## 我想把这里做成什么样

这个博客对我来说，不只是一个放文章的网站。

我更希望它像是我的一个小空间：

- 记录学习 AI 开发的过程
- 分享自己折腾网站和代码时的想法
- 放一些日常、游戏和兴趣相关的内容
- 见证自己从小白一步步成长起来

如果你也喜欢 AI、代码，或者也玩 CS 和洛克王国，那这里大概会有一些我们能聊得来的东西。

---

## 最后

现在的我或许还不算厉害，但我愿意持续学习，也愿意认真把喜欢的东西坚持下去。

欢迎来到我的小站，希望未来我能在这里留下越来越多真正属于自己的内容。`,
      category: "随笔",
      tags: "自我介绍,AI开发,CS,洛克王国,成长记录",
      pinned: true,
      published: true,
      publishedAt: new Date("2026-06-24"),
    },
    {
      slug: "cs-not-just-a-game",
      title: "CS 不只是游戏：关于专注与判断",
      description: "从 Counter-Strike 中领悟到的专注力、判断力和团队协作，以及它们与编程的共通之处。",
      content: `## 游戏中的反思

玩 CS 已经有一段时间了，最近越来越觉得这款游戏教会我的东西，远不止"怎么打枪"这么简单。

### 专注力的训练

在 CS 中，一个走神可能就意味着被击杀。这种持续保持高度专注的状态，和编程时需要的"心流"体验非常相似。

### 判断力的提升

什么时候该进攻，什么时候该防守，什么时候该转点 —— 这些决策都需要在极短的时间内做出。写代码时同样需要这样的判断力：选择什么技术栈，如何设计架构，什么时候重构。

### 团队协作的重要性

一个人再强也赢不了五个人的队伍。编程也是一样，现代软件开发早已不是单打独斗的时代。

---

## 写在最后

游戏不只是娱乐，它也是一种学习的方式。重要的是，我们愿不愿意从中思考，愿不愿意把学到的东西用到生活中。`,
      category: "随笔",
      tags: "CS,游戏,思考,成长",
      pinned: false,
      published: true,
      publishedAt: new Date("2026-06-28"),
    },
    {
      slug: "building-my-blog",
      title: "从零搭建个人博客：我的建站之路",
      description: "分享我用 Astro + Firefly 主题搭建个人博客的完整过程，包括技术选型、部署和优化。",
      content: `## 为什么想要建博客

很早以前就想要一个属于自己的地方，可以记录学习、分享想法、留下一些自己存在过的痕迹。

## 技术选型

最终选择了 **Astro** 框架 + **Firefly** 主题（基于 Fuwari 二次开发）。

选择的原因：
- Astro 性能优秀，静态生成速度快
- Firefly 主题美观，功能丰富
- 支持 Markdown 写文章
- 暗色模式、响应式设计

## 部署过程

使用了宝塔面板进行部署，整个过程包括：
- 环境配置（Node.js、pnpm）
- 代码构建
- Nginx 配置
- SSL 证书申请

## 踩过的坑

1. 构建时内存不足 —— 解决：增加 swap
2. 图片加载慢 —— 解决：使用 CDN
3. 评论系统配置 —— 解决：使用 Giscus

---

## 总结

这次建站经历让我学到了很多，也让我更加确信：有了 AI 的帮助，一个人也可以做出很棒的东西。`,
      category: "技术",
      tags: "建站,Astro,Firefly,技术分享,部署",
      pinned: false,
      published: true,
      publishedAt: new Date("2026-06-27"),
    },
    {
      slug: "ai-development-guide",
      title: "AI 开发入门：从零开始的小白之路",
      description: "作为一个刚接触 AI 开发的小白，分享这段时间的学习心得和踩过的坑。",
      content: `## 写在前面

我是一个真正的"小白"，所以这篇文章只适合同样从零开始的朋友。

## 我做了什么

### 第一步：了解基础概念

- 什么是大语言模型（LLM）
- 什么是 Prompt Engineering
- 什么是 API 调用

### 第二步：动手实践

从最简单的开始：调用 OpenAI API 写一个聊天机器人。

### 第三步：做点小项目

- 用 AI 辅助写博客
- 做一个简单的自动化工具
- 尝试 Fine-tuning

## 踩过的坑

1. **API 费用失控** —— 一定要设置限额
2. **Prompt 写得不好** —— 需要不断迭代优化
3. **过度依赖 AI** —— 理解原理很重要

## 给新手的建议

- 不要怕犯错，多动手
- 善用 AI 辅助学习
- 记录学习过程，写博客是很好的方式

---

## 最后

学习 AI 开发是一段有趣的旅程，希望这篇文章对你有所帮助。`,
      category: "技术",
      tags: "AI开发,学习心得,入门指南,技术成长",
      pinned: false,
      published: true,
      publishedAt: new Date("2026-06-26"),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`✅ ${posts.length} 篇文章已导入`);

  // Create moments
  const moments = [
    {
      content: "今天在洛克王国里又培养了一只新的宠物。慢慢养宠物的感觉真的很治愈，不需要急，一步一步来就好。有时候觉得，养宠物和学编程很像 - 都需要耐心和坚持。希望这只宠物能慢慢变强。",
      mood: "打游戏",
      tags: "洛克王国,游戏,日常",
      createdAt: new Date("2026-06-30"),
    },
    {
      content: "今天花了一个小时研究大语言模型的 API 调用。虽然还是小白水平，但已经能写出一些简单的自动化工具了。感觉每天进步一点点，积累起来就是很大的变化。加油！",
      mood: "写代码",
      tags: "学习,AI开发,碎碎念",
      createdAt: new Date("2026-06-29"),
    },
    {
      content: "晚饭后出去散了个步，天气不错。有时候觉得，生活不只有代码和游戏。偶尔停下来，看看周围的风景，也是一种放松。明天继续加油。",
      mood: "开心",
      tags: "日常,生活",
      createdAt: new Date("2026-06-29T18:00:00"),
    },
    {
      content: `今天继续把博客往自己的风格上改了一大步。从头像、壁纸、评论区，到留言板和部署流程，终于慢慢有了「这是我自己的站」的感觉。虽然中间踩了很多坑，但每修好一个点都会很有成就感。接下来想继续把这里填得更丰富一点，多写点内容，也多记录一些游戏和日常。`,
      mood: "写代码",
      tags: "建站,碎碎念,AI开发",
      createdAt: new Date("2026-06-25"),
    },
    {
      content: "折腾了很久，终于把博客从原来的测试状态一步步切成了自己的正式版本。今天主要做了这些事：\n- 把网站源码重新整理并推到自己的 GitHub 仓库\n- 在宝塔上把测试站和正式站都跑起来\n- 把评论系统切换到了 Giscus\n- 修了留言板评论绑定不稳定的问题",
      mood: "写代码",
      tags: "建站,部署,碎碎念",
      createdAt: new Date("2026-06-25T15:00:00"),
    },
    {
      content: "最近一边在折腾博客，一边也在继续玩洛克王国。有时候会觉得挺神奇的，一边是代码、部署、配置、评论系统，另一边又是游戏、日常和一些很碎片的想法。不过我现在越来越喜欢这种状态：白天解决点技术问题，晚上写一点东西，顺手再记录一点生活里的小片段。",
      mood: "思考中",
      tags: "AI开发,洛克王国,日常",
      createdAt: new Date("2026-06-24"),
    },
    {
      content: "有时候觉得写代码和玩洛克王国很像，都是慢慢积累、慢慢成长的过程。不需要一下子做到很厉害，只要今天比昨天多懂一点点，多完成一点点，就已经很好了。",
      mood: "打游戏",
      tags: "洛克王国,日常",
      createdAt: new Date("2026-06-24T20:00:00"),
    },
  ];

  // Clear existing moments first
  await prisma.moment.deleteMany({});
  for (const moment of moments) {
    await prisma.moment.create({ data: moment });
  }
  console.log(`✅ ${moments.length} 条动态已导入`);

  // Create friends
  const friends = [
    {
      title: "夏夜流萤",
      imgurl: "https://weavatar.com/avatar/d252655d40d6874417a720bad0a6c5f77f8f6a1fd2f882f8f338402dc37e4190?s=640",
      description: "飞萤之火自无梦的长夜亮起，绽放在终竟的明天。",
      siteurl: "https://blog.cuteleaf.cn",
      tags: "Blog",
      weight: 10,
      enabled: true,
    },
  ];

  await prisma.friend.deleteMany({});
  for (const friend of friends) {
    await prisma.friend.create({ data: friend });
  }
  console.log(`✅ ${friends.length} 个友链已导入`);

  // Create gallery albums
  const albums = [
    {
      slug: "luoke",
      name: "洛克王国日常",
      description: "洛克王国的日常游戏截图记录。",
      location: "洛克王国",
      date: "2026-06-01",
      cover: "/gallery/luoke/微信图片_20260624193819_20_2.png",
      tags: "洛克王国",
      photoCount: 20,
    },
    {
      slug: "gugugaga",
      name: "咕咕嘎嘎真可爱",
      description: "咕咕嘎嘎相关图片收集。",
      location: "收集",
      date: "2026-06-01",
      cover: "/gallery/gugugaga/微信图片_20260624194440_107_2.jpg",
      tags: "收集,咕咕嘎嘎",
      photoCount: 1,
    },
  ];

  await prisma.galleryAlbum.deleteMany({});
  for (const album of albums) {
    await prisma.galleryAlbum.create({ data: album });
  }
  console.log(`✅ ${albums.length} 个相册已导入`);

  console.log("\n🎉 种子数据导入完成！");
  console.log("管理员账号: admin");
  console.log("管理员密码: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
