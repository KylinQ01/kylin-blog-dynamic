# Kylin Blog 🦄

**[简体中文](README.md)** | **[English](README.en.md)** | **[日本語](README.ja.md)** | **[한국어](README.ko.md)**

爽やかな和風デザインの動的ブログシステムです。Next.js によるフルスタック実装で、ティールを基調とした配色、ガラスモーフィズムのカード、フロントエンドと管理画面を一体化した構成が特徴です。

## ✨ 技術スタック

| レイヤー | 技術 |
| --- | --- |
| フレームワーク | Next.js 16 (App Router) + React 19 |
| バックエンド | Next.js Route Handlers (API) |
| データベース | SQLite + Prisma 7 + better-sqlite3 |
| 認証 | JWT（httpOnly Cookie） |
| スタイル | Tailwind CSS 4 + 独自デザインシステム（CSS 変数） |
| 言語 | TypeScript |

## 📦 機能一覧

### フロントエンド
- **ホーム**：ピン留め記事、最新記事、アクティビティフィードをまとめて表示します
- **記事システム**：一覧／詳細／カテゴリ／タグ／アーカイブに対応し、ピン留め、パスワード保護、閲覧数カウントをサポートします
- **つぶやき (Moments)**：短い投稿の公開と表示
- **伝言板**：ゲストコメント（登録なしで投稿できます）
- **フレンドリンク**：申請制のフレンドリンク
- **アルバム**：アルバム単位で整理し、カバー画像と画像ビューアを提供します
- **プロフィール**：About、サポート、アニメ視聴記録 (Bangumi)、音楽プレーヤー、Type など
- **ウィジェット**：天気カード（30 分間のモジュールレベルキャッシュで外部 API リクエストを削減）
- **爽やかな和風デザイン**：ティールのアンビエントグロー背景、カードホバーのグロー、グラデーションのアクティブナビゲーション、ライト／ダークの 2 テーマ

### 管理画面 (`/admin`)
- JWT ログイン認証（httpOnly Cookie、有効期限 1 時間）
- ダッシュボード：データの概要統計
- コンテンツ管理：記事／つぶやき／フレンドリンク／アルバム／コメントの CRUD
- サイト設定：サイト名、サブタイトル、説明をオンラインで保存（`data/settings.json`、5 秒キャッシュ）
- 画像アップロード：実行時にアップロードし、`/uploads/[filename]` ルート経由で配信します

## 🚀 クイックスタート

```bash
# 1. 依存関係をインストール（ネイティブモジュール better-sqlite3 にはプラットフォームに合ったバイナリが必要）
npm install

# 2. データベースを初期化し、Prisma Client を生成
npx prisma migrate dev --name init
npm run seed        # 任意：サンプルデータを投入

# 3. 環境変数を設定
# .env.example を .env にコピーし、DATABASE_URL と JWT_SECRET を入力

# 4. 開発サーバーを起動
npm run dev
```

http://localhost:3000 にアクセスします。管理画面の入口は http://localhost:3000/admin です。

## 📁 ディレクトリ構成

```
src/
├── app/                 # App Router のページと API
│   ├── (public)/        # 公開ページ
│   ├── admin/           # 管理画面（ログイン + ダッシュボード）
│   ├── api/             # REST API（記事／つぶやき／フレンドリンク／アルバム／コメント／設定／認証）
│   └── uploads/         # 実行時のアップロードファイル配信
├── components/          # コンポーネント（レイアウト、ウィジェット、管理画面）
└── lib/                 # ユーティリティ（prisma、auth、settings）
prisma/
├── schema.prisma        # データモデル（User/Post/Moment/Friend/...）
└── seed.ts              # サンプルデータ
data/settings.json       # サイト設定（実行時に生成）
```

## 🔑 環境変数

| 変数 | 説明 |
| --- | --- |
| `DATABASE_URL` | SQLite データベース接続（`file:./dev.db`） |
| `JWT_SECRET` | JWT 署名用のシークレット |

## 🛠️ 本番デプロイ

```bash
npm run build
npm start        # 本番モード、既定は http://localhost:3000
```

> 注意：本番モード（`next start`）では、実行中に `public/` へ追加したファイルは配信されません。本プロジェクトは `/uploads/[filename]` の動的ルートでフォールバックしています。

## 📜 ライセンス

MIT License

---

*Kylin Blog — 記録と共有のための爽やかな一角です。*
