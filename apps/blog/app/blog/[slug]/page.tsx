import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { imageBuilder } from "@/lib/sanity.image";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { postBySlugQuery, postMetadataBySlugQuery, postSlugsQuery } from "@/lib/sanity.queries";
import type { PostDetail, PostMetadata } from "@/lib/sanity.types";

export const revalidate = 300;

type PageProps = {
  params: {
    slug: string;
  };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

function formatDate(date?: string) {
  if (!date) return "Draft";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

async function getPost(slug: string) {
  if (!isSanityConfigured) return null;

  return sanityClient.fetch<PostDetail | null>(
    postBySlugQuery,
    { slug },
    { next: { revalidate, tags: ["post", `post:${slug}`] } },
  );
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return [];

  const slugs = await sanityClient.fetch<string[]>(postSlugsQuery, {}, { next: { revalidate } });

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isSanityConfigured) {
    return {
      title: "Blog Post",
      description: "Sanity content is not configured yet.",
    };
  }

  const post = await sanityClient.fetch<PostMetadata | null>(
    postMetadataBySlugQuery,
    { slug: params.slug },
    { next: { revalidate, tags: ["post", `post:${params.slug}`] } },
  );

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "VUKA Travels blog post";
  const imageUrl = post.mainImage
    ? imageBuilder.image(post.mainImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteUrl}/blog/${post.slug}`,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: post.author?.name
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : undefined,
    image: post.mainImage
      ? imageBuilder.image(post.mainImage).width(1200).height(630).fit("crop").url()
      : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "VUKA Travels",
      url: siteUrl,
    },
  };

  return (
    <article className="article">
      <h1 className="article-title">{post.title}</h1>
      <div className="article-meta">
        {formatDate(post.publishedAt)}
        {post.author?.name ? ` • ${post.author.name}` : ""}
      </div>

      {post.categories?.length ? (
        <div>
          {post.categories.map((category) => (
            <span className="pill" key={`${post._id}-${category}`}>
              {category}
            </span>
          ))}
        </div>
      ) : null}

      {post.mainImage ? (
        <Image
          className="article-image"
          src={imageBuilder.image(post.mainImage).width(1600).height(900).fit("crop").url()}
          alt={post.mainImage.alt || post.title}
          width={1600}
          height={900}
          priority
        />
      ) : null}

      <div className="richtext">
        <PortableTextRenderer value={post.body} />
      </div>

      <script
        type="application/ld+json"
        // json-ld needs to be injected as a raw string for crawlers.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </article>
  );
}
