# Kylin Blog 🦄

**[简体中文](README.md)** | **[English](README.en.md)** | **[日本語](README.ja.md)** | **[한국어](README.ko.md)**

清新日系风格的动态博客系统 —— 基于 Next.js 的全栈实现，青绿主色调、玻璃拟态卡片，前后端一体化管理。

## ✨ 技术栈

| 层 | 技术 |
| --- | --- |
| 框架 | Next.js 16 (App Router) + React 19 |
| 后端 | Next.js Route Handlers (API) |
| 数据库 | SQLite + Prisma 7 + better-sqlite3 |
| 认证 | JWT（httpOnly Cookie） |
| 样式 | Tailwind CSS 4 + 自定义设计系统（CSS 变量） |
| 语言 | TypeScript |

## 📦 功能特性

### 前端
- **首页**：置顶文章、最新文章、动态流聚合展示
- **文章系统**：列表 / 详情 / 分类 / 标签 / 归档，支持置顶、密码保护、浏览量统计
- **动态 (Moments)**：碎碎念发布与展示
- **留言板**：访客评论（无需注册即可留言）
- **友链**：申请式友链展示
- **相册**：按相册组织、封面图、图片浏览
- **个人页**：关于、赞助、动漫追番 (Bangumi)、音乐播放器、Type 等
- **小组件**：天气卡片（30 分钟模块级缓存，减少外部 API 请求）
- **清新日系设计**：青绿氛围光晕背景、卡片 hover 光晕、渐变激活导航，亮/暗双主题

### 后台管理 (`/admin`)
- JWT 登录认证（httpOnly Cookie，1 小时过期）
- 仪表盘：数据总览统计
- 内容管理：文章 / 动态 / 友链 / 相册 / 留言 的增删改查
- 站点设置：站点名称、副标题、描述在线保存（`data/settings.json`，5 秒缓存）
- 图片上传：运行时上传，通过 `/uploads/[filename]` 路由服务

## 🚀 快速开始

```bash
# 1. 安装依赖（原生模块 better-sqlite3 需要匹配平台的二进制）
npm install

# 2. 初始化数据库并生成 Prisma Client
npx prisma migrate dev --name init
npm run seed        # 可选：填充示例数据

# 3. 配置环境变量
# 复制 .env.example 为 .env，填入 DATABASE_URL 与 JWT_SECRET

# 4. 启动开发服务器
npm run dev
```

访问 http://localhost:3000，后台入口 http://localhost:3000/admin。

## 📁 目录结构

```
src/
├── app/                 # App Router 页面与 API
│   ├── (public)/        # 前端页面
│   ├── admin/           # 后台管理（登录 + 仪表盘）
│   ├── api/             # REST API（文章/动态/友链/相册/评论/设置/认证）
│   └── uploads/         # 运行时上传文件服务
├── components/          # 组件（布局、小组件、后台）
└── lib/                 # 工具库（prisma、auth、settings）
prisma/
├── schema.prisma        # 数据模型（User/Post/Moment/Friend/...）
└── seed.ts              # 示例数据
data/settings.json       # 站点设置（运行时生成）
```

## 🔑 环境变量

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | SQLite 数据库连接（`file:./dev.db`） |
| `JWT_SECRET` | JWT 签名密钥 |

## 🛠️ 生产部署

```bash
npm run build
npm start        # 生产模式，默认 http://localhost:3000
```

> 注意：生产模式（`next start`）不会服务运行时新放入 `public/` 的文件，本项目已通过 `/uploads/[filename]` 动态路由兜底。

## 📜 开源协议

MIT License

---

*Kylin Blog —— 记录与分享的清新角落。*
