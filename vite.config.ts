import { r } from "./scripts/utils";
import { extId } from "./src/const";
import manifest from "./src/manifest";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { ViteWebExtKits } from "@webextkits/vite-plugins";
import getPort from "get-port";
import { defineConfig } from "vite";

const port = await getPort();

export default defineConfig({
  //  https://github.com/crxjs/chrome-extension-tools/issues/746
  server: {
    strictPort: true,
    port: port,
    hmr: {
      clientPort: port,
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: r("src"),
      },
    ],
  },
  plugins: [
    crx({ manifest }),
    react({
      jsxRuntime: "automatic",
    }),
    ViteWebExtKits({
      extensionId: extId,
      externals: ["antd/locale/zh_CN"],
    }),
  ],
});
