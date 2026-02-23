import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const devFormProxyTarget = process.env.VITE_DEV_FORM_PROXY_TARGET || "https://vukatravels.co.uk";

  return {
    plugins: [
      {
        name: "landing-pages-dev-rewrite",
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            const url = req.url;
            if (!url) {
              next();
              return;
            }

            const [pathname, query = ""] = url.split("?");
            const suffix = query ? `?${query}` : "";
            const rewrites: Record<string, string> = {
              "/cheap-flights-from-london-to-dubai": "/cheap-flights-from-london-to-dubai/index.html",
              "/cheap-flights-from-london-to-dubai/": "/cheap-flights-from-london-to-dubai/index.html",
              "/flights-from-london-to-dubai": "/flights-from-london-to-dubai/index.html",
              "/flights-from-london-to-dubai/": "/flights-from-london-to-dubai/index.html",
              "/cheap-flights-from-london-to-lagos": "/cheap-flights-from-london-to-lagos/index.html",
              "/cheap-flights-from-london-to-lagos/": "/cheap-flights-from-london-to-lagos/index.html",
              "/flights-from-london-to-lagos": "/flights-from-london-to-lagos/index.html",
              "/flights-from-london-to-lagos/": "/flights-from-london-to-lagos/index.html",
              "/cheap-flights-from-london-to-accra": "/cheap-flights-from-london-to-accra/index.html",
              "/cheap-flights-from-london-to-accra/": "/cheap-flights-from-london-to-accra/index.html",
              "/flights-from-london-to-accra": "/flights-from-london-to-accra/index.html",
              "/flights-from-london-to-accra/": "/flights-from-london-to-accra/index.html",
              "/cheap-flights-from-london-to-harare": "/cheap-flights-from-london-to-harare/index.html",
              "/cheap-flights-from-london-to-harare/": "/cheap-flights-from-london-to-harare/index.html",
              "/flights-from-london-to-harare": "/flights-from-london-to-harare/index.html",
              "/flights-from-london-to-harare/": "/flights-from-london-to-harare/index.html",
              "/cheap-flights-from-london-to-entebbe": "/cheap-flights-from-london-to-entebbe/index.html",
              "/cheap-flights-from-london-to-entebbe/": "/cheap-flights-from-london-to-entebbe/index.html",
              "/flights-from-london-to-entebbe": "/flights-from-london-to-entebbe/index.html",
              "/flights-from-london-to-entebbe/": "/flights-from-london-to-entebbe/index.html",
              "/flights-to-dubai-from-uk": "/flights-to-dubai-from-uk/index.html",
              "/flights-to-dubai-from-uk/": "/flights-to-dubai-from-uk/index.html",
              "/flights-to-lagos-from-uk": "/flights-to-lagos-from-uk/index.html",
              "/flights-to-lagos-from-uk/": "/flights-to-lagos-from-uk/index.html",
              "/flights-to-accra-from-uk": "/flights-to-accra-from-uk/index.html",
              "/flights-to-accra-from-uk/": "/flights-to-accra-from-uk/index.html",
              "/flights-to-harare-from-uk": "/flights-to-harare-from-uk/index.html",
              "/flights-to-harare-from-uk/": "/flights-to-harare-from-uk/index.html",
              "/flights-to-entebbe-from-uk": "/flights-to-entebbe-from-uk/index.html",
              "/flights-to-entebbe-from-uk/": "/flights-to-entebbe-from-uk/index.html",
              "/flight-deals-to-nairobi": "/flight-deals-to-nairobi/index.html",
              "/flight-deals-to-nairobi/": "/flight-deals-to-nairobi/index.html",
              "/holiday-packages-to-zanzibar": "/holiday-packages-to-zanzibar/index.html",
              "/holiday-packages-to-zanzibar/": "/holiday-packages-to-zanzibar/index.html",
            };

            const rewriteTarget = rewrites[pathname];
            if (rewriteTarget) {
              req.url = `${rewriteTarget}${suffix}`;
            }

            next();
          });
        },
      },
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api/submit.php": {
          target: devFormProxyTarget,
          changeOrigin: true,
          secure: true,
        },
        "/api/submit": {
          target: devFormProxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
