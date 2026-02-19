import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET || "";

type RevalidatePayload = {
  slug?: string;
};

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }

  let payload: RevalidatePayload = {};

  try {
    payload = (await request.json()) as RevalidatePayload;
  } catch {
    // allow empty payload for full blog revalidate
  }

  revalidatePath("/blog");
  revalidateTag("post");

  if (payload.slug) {
    revalidatePath(`/blog/${payload.slug}`);
    revalidateTag(`post:${payload.slug}`);
  }

  return NextResponse.json({ ok: true, revalidated: payload.slug ? ["/blog", `/blog/${payload.slug}`] : ["/blog"] });
}
