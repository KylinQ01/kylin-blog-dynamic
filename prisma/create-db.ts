import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");

// Remove existing db
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT NOT NULL DEFAULT '',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL DEFAULT '',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "Moment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "mood" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "Friend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imgurl" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "siteurl" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "weight" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "GalleryAlbum" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "cover" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "photoCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "postId" TEXT,
    "page" TEXT NOT NULL DEFAULT 'guestbook',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
  );
`);

console.log("✅ Database tables created successfully!");
db.close();
