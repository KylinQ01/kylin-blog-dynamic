import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommentForm } from "@/components/CommentForm";

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (post) {
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return post;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function renderMarkdown(content: string): string {
  let html = content;
  html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/^- (.*$)/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^---$/gm, "<hr/>");
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<(?:h[1-6]|ul|ol|pre|blockquote|hr))/g, "$1");
  html = html.replace(/(<\/(?:h[1-6]|ul|ol|pre|blockquote|)>)<\/p>/g, "$1");
  return html;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const contentHtml = renderMarkdown(post.content);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <article className="card-base card-padding">
          <header className="mb-6 pb-6 border-b" style={{ borderColor: "var(--card-border)" }}>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
              <span>作者: {siteConfig.profile.name}</span>
              <span>发布于: {formatDate(post.publishedAt)}</span>
              {post.category && (
                <Link
                  href={`/categories/${encodeURIComponent(post.category)}`}
                  className="px-2 py-0.5 rounded-full bg-[var(--accent)] hover:text-[var(--primary)]"
                >
                  {post.category}
                </Link>
              )}
            </div>
            {post.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.split(",").map((tag) => (
                  <Link key={tag.trim()} href={`/tags/${encodeURIComponent(tag.trim())}`} className="tag">
                    #{tag.trim()}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          <footer className="mt-8 pt-6 border-t" style={{ borderColor: "var(--card-border)" }}>
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>许可协议: {siteConfig.license.name}</span>
              <span>字数: {post.content.length}</span>
            </div>
          </footer>
        </article>

        <div className="mt-6">
          <CommentForm page="post" postId={post.id} />
        </div>
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}
