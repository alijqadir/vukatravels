import Link from "next/link";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { postsQuery } from "@/lib/sanity.queries";
import type { PostListItem } from "@/lib/sanity.types";

export const revalidate = 300;

async function getPosts() {
  if (!isSanityConfigured) {
    return [] as PostListItem[];
  }

  return sanityClient.fetch<PostListItem[]>(postsQuery, {}, { next: { revalidate, tags: ["post"] } });
}

function formatDate(date?: string) {
  if (!date) return "Draft";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <section className="container">
      <h1 className="page-title">VUKA Travels Blog</h1>
      <p className="page-subtitle">
        Publish destination guides, flight tips, and holiday planning content through Sanity Studio.
      </p>

      {!isSanityConfigured && (
        <div className="notice">
          Sanity is not configured yet. Add values in <code>apps/blog/.env.local</code> to fetch posts.
        </div>
      )}

      {isSanityConfigured && posts.length === 0 && (
        <div className="notice">
          No posts found yet. Create your first post in <code>/studio</code>.
        </div>
      )}

      <div className="post-grid">
        {posts.map((post) => (
          <article className="post-card" key={post._id}>
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
            </Link>
            <div className="post-meta">
              {formatDate(post.publishedAt)}
              {post.authorName ? ` • ${post.authorName}` : ""}
            </div>
            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
            {post.categories?.map((category) => (
              <span key={`${post._id}-${category}`} className="pill">
                {category}
              </span>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
