export type FormPayload = Record<string, unknown>;

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function resolveFormEndpoint() {
  if (typeof window !== "undefined" && isLocalHostname(window.location.hostname)) {
    return "/api/submit.php";
  }

  return import.meta.env.VITE_FORM_ENDPOINT || "/api/submit.php";
}

const DEFAULT_ENDPOINT = resolveFormEndpoint();

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function pushDataLayerEvent(formType: string, payload: FormPayload) {
  if (typeof window === "undefined") return;

  const email = typeof payload.email === "string" ? payload.email : "";
  const phone = typeof payload.phone === "string" ? payload.phone : "";

  const event: Record<string, unknown> = {
    event: "generate_lead",
    form_type: formType,
    lead_source: "website",
    currency: "GBP",
    value: 0,
  };

  if (email || phone) {
    event.user_data = {
      email: email || undefined,
      phone: phone || undefined,
    };
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

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

  pushDataLayerEvent(formType, payload);
  return data;
}
