import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "@/lib/sanity.client";

const builder = createImageUrlBuilder(sanityClient);

export const imageBuilder = {
  image(source: SanityImageSource) {
    return builder.image(source);
  },
};
