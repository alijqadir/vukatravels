import { createClient } from "next-sanity";

const apiVersion = "2025-02-19";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
const hasReadToken = Boolean(process.env.SANITY_API_READ_TOKEN);

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = createClient({
  projectId: projectId || "placeholder-project-id",
  dataset: dataset || "production",
  apiVersion,
  useCdn: !hasReadToken,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: hasReadToken ? "drafts" : "published",
  stega: false,
});
