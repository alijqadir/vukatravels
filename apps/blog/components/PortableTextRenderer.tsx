import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");

      if (isExternal) {
        return (
          <a href={href} rel="noopener noreferrer" target="_blank">
            {children}
          </a>
        );
      }

      return <Link href={href}>{children}</Link>;
    },
  },
};

export default function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  if (!value?.length) return null;

  return <PortableText value={value} components={components} />;
}
