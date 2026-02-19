# Blog Deployment Steps (Main site + Next blog on one domain)

This runbook serves:

- Main site (existing Vite build + Express API) on port `3000`
- Blog app (`apps/blog` Next.js + Sanity) on port `3001`
- One domain with blog under `/blog`

## 1) Configure environment files

### Root app (`.env`)

Set:

```env
PORT=3000
VITE_BLOG_URL=/blog
```

Keep your existing SMTP values as they are.

### Blog app (`apps/blog/.env.local`)

Create file and set:

```env
NEXT_PUBLIC_SITE_URL=https://vukatravels.co.uk
NEXT_PUBLIC_MAIN_SITE_URL=https://vukatravels.co.uk
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token_if_needed
SANITY_REVALIDATE_SECRET=long_random_secret
```

## 2) Install dependencies

From repo root:

```bash
npm ci
npm run blog:install
```

## 3) Build both apps

From repo root:

```bash
npm run build
npm run blog:build
```

## 4) Run both apps with PM2

From repo root:

```bash
pm2 start npm --name vuka-main -- start
pm2 start npm --name vuka-blog -- run blog:start
pm2 save
pm2 startup
```

Check:

```bash
pm2 status
curl -I http://127.0.0.1:3000
curl -I http://127.0.0.1:3001/blog
```

## 5) Configure Nginx routing

Use this server block (replace domain):

```nginx
server {
    listen 80;
    server_name vukatravels.co.uk www.vukatravels.co.uk;

    client_max_body_size 10m;

    # Blog routes to Next.js app
    location = /blog {
        proxy_pass http://127.0.0.1:3001;
        include /etc/nginx/proxy_params;
        proxy_http_version 1.1;
    }

    location ^~ /blog/ {
        proxy_pass http://127.0.0.1:3001;
        include /etc/nginx/proxy_params;
        proxy_http_version 1.1;
    }

    # Sanity Studio
    location = /studio {
        proxy_pass http://127.0.0.1:3001;
        include /etc/nginx/proxy_params;
        proxy_http_version 1.1;
    }

    location ^~ /studio/ {
        proxy_pass http://127.0.0.1:3001;
        include /etc/nginx/proxy_params;
        proxy_http_version 1.1;
    }

    # Blog ISR webhook
    location = /api/revalidate {
        proxy_pass http://127.0.0.1:3001;
        include /etc/nginx/proxy_params;
        proxy_http_version 1.1;
    }

    # Optional: expose blog sitemap via root domain
    location = /blog-sitemap.xml {
        proxy_pass http://127.0.0.1:3001/sitemap.xml;
        include /etc/nginx/proxy_params;
        proxy_http_version 1.1;
    }

    # Main site API stays on main app
    location ^~ /api/ {
        proxy_pass http://127.0.0.1:3000;
        include /etc/nginx/proxy_params;
        proxy_http_version 1.1;
    }

    # Everything else to main site app
    location / {
        proxy_pass http://127.0.0.1:3000;
        include /etc/nginx/proxy_params;
        proxy_http_version 1.1;
    }
}
```

Enable and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6) Configure Sanity webhook (for instant publish updates)

In Sanity project settings:

- URL: `https://vukatravels.co.uk/api/revalidate?secret=YOUR_SANITY_REVALIDATE_SECRET`
- Method: `POST`
- Trigger: create/update/delete for `post`
- Payload:

```json
{ "slug": "${slug.current}" }
```

## 7) Verify end-to-end

1. Open `https://vukatravels.co.uk/blog` and check post list loads.
2. Open `https://vukatravels.co.uk/studio` and publish a post.
3. Confirm new post appears quickly (webhook + ISR).
4. Open `https://vukatravels.co.uk/blog-sitemap.xml`.
5. Click Blog in main site header/footer and confirm it leaves the SPA and loads Next blog.
