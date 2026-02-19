import type { PortableTextBlock } from "@portabletext/types";

export type SanityImage = {
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  authorName?: string;
  categories?: string[];
};

export type PostAuthor = {
  name?: string;
  bio?: PortableTextBlock[];
  image?: SanityImage;
};

export type PostDetail = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  updatedAt?: string;
  body: PortableTextBlock[];
  mainImage?: SanityImage;
  author?: PostAuthor;
  categories?: string[];
};

export type PostMetadata = {
  title: string;
  slug: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  updatedAt?: string;
  mainImage?: SanityImage;
};
