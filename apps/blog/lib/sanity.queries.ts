import { groq } from "next-sanity";

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "authorName": author->name,
      "categories": categories[]->title
    }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    seoTitle,
    seoDescription,
    publishedAt,
    updatedAt,
    body,
    mainImage {
      asset,
      alt
    },
    "author": author-> {
      name,
      bio,
      image
    },
    "categories": categories[]->title
  }
`;

export const postMetadataBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    excerpt,
    seoTitle,
    seoDescription,
    publishedAt,
    updatedAt,
    mainImage {
      asset,
      alt
    }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;
