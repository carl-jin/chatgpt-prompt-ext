import packageJson from "../package.json";
import { hostMatches } from "./const";
import { defineManifest } from "@crxjs/vite-plugin";

const { version } = packageJson;

const [major, minor, patch] = version.replace(/[^\d.-]+/g, "").split(/[.-]/);

export default defineManifest(async () => ({
  manifest_version: 3,
  name: `全局 chatgpt`,
  description: `全局 chatgpt`,
  version: `${major}.${minor}.${patch}`,
  author: {
    name: "carljin",
    email: "carljin@gmail.com",
  },
  minimum_chrome_version: "103",
  version_name: version,
  // content_scripts: [
  //   {
  //     js: ["src/scopes/content/index.ts"],
  //     matches: hostMatches,
  //     run_at: "document_end",
  //   },
  // ],
  background: {
    service_worker: "src/scopes/background/index.ts",
    type: "module",
  },
  permissions: ["tabs", "scripting", "storage", "commands"],
  options_page: "src/scopes/options/index.html",
  action: {
    default_icon: "assets/logo-128.png",
    default_popup: "src/scopes/popup/index.html",
  },
  host_permissions: hostMatches,
  icons: {
    "16": "assets/logo-16.png",
    "19": "assets/logo-19.png",
    "32": "assets/logo-32.png",
    "38": "assets/logo-38.png",
    "48": "assets/logo-48.png",
    "128": "assets/logo-128.png",
  },
  web_accessible_resources: [
    {
      resources: ["*"],
      matches: hostMatches,
    },
  ],
  externally_connectable: {
    matches: hostMatches,
  },
  commands: {
    naming_variable: {
      suggested_key: {
        windows: "Ctrl+Shift+1",
        mac: "MacCtrl+Shift+1",
      },
      description: "变量命名 AI",
      global: true, // 这里设置为全局快捷键
    },
    translate: {
      suggested_key: {
        windows: "Ctrl+Shift+2",
        mac: "MacCtrl+Shift+2",
      },
      description: "翻译成英文",
      global: true, // 这里设置为全局快捷键
    },
  },
}));
