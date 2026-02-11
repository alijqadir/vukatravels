export type FormPayload = Record<string, unknown>;

const DEFAULT_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || "/api/submit.php";

export async function submitForm(formType: string, payload: FormPayload) {
  const res = await fetch(DEFAULT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formType,
      ...payload,
    }),
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      (typeof data === "object" && data && "error" in data && typeof (data as any).error === "string"
        ? (data as any).error
        : "Failed to submit form. Please try again.");
    throw new Error(message);
  }

  return data;
}
