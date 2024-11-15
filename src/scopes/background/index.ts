import { extId, hostMatches } from "@/const";
import { SchemaType, schema } from "@/schema/index";
import { useMessages } from "./hooks/useMessages";
import { injectExtensionData } from "@webextkits/messages-center/hooks";
import { useAutoFillBuckets } from "@webextkits/storage-local";

injectExtensionData({
  hostMatch: hostMatches,
  extensionId: extId,
  isDev: import.meta.env.DEV,
});
useAutoFillBuckets<SchemaType>(schema);
useMessages();

chrome.commands.onCommand.addListener(async (command) => {
  if (["naming_variable", "translate"].includes(command)) {
    await chrome.runtime.openOptionsPage();
    const tabs = await chrome.tabs.query({
      url: chrome.runtime.getURL("src/scopes/options/index.html"),
    });
    if (tabs[0]) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await chrome.tabs.sendMessage(tabs[0].id as number, {
        command: command,
      });
    }
  }
});

// chrome.scripting.registerContentScripts([
//   {
//     id: `inject-${extId}-module`,
//     js: ["externals.js", "injects/index.js"],
//     css: ["injects/index.css"],
//     matches: hostMatches,
//     runAt: "document_end",
//     //  @ts-ignore
//     world: "MAIN",
//   },
// ]);
