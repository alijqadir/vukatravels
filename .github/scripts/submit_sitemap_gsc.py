import json
import os

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build


def main():
    site_url = os.environ.get("GSC_SITE_URL")
    sitemap_url = os.environ.get("SITEMAP_URL")
    sa_json = os.environ.get("GSC_SA_JSON")

    if not site_url or not sitemap_url or not sa_json:
        print("Missing env vars. Required: GSC_SITE_URL, SITEMAP_URL, GSC_SA_JSON")
        return 2

    info = json.loads(sa_json)
    scopes = ["https://www.googleapis.com/auth/webmasters"]
    creds = Credentials.from_service_account_info(info, scopes=scopes)

    service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

    try:
        service.sitemaps().submit(siteUrl=site_url, feedpath=sitemap_url).execute()
        print(f"Submitted sitemap to GSC: {sitemap_url} for {site_url}")
        return 0
    except Exception as e:
        msg = repr(e)
        print("GSC submit failed:", msg)
        # Don't break deployments if permissions aren't set yet.
        if "HttpError 403" in msg or "insufficient permission" in msg.lower() or "forbidden" in msg.lower():
            return 0
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
