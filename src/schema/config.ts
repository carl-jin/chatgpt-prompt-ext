import { JSONSchemaType } from "@webextkits/storage-local";

export type ConfigSchemaType = {
  chatGPTAPIToken: string;
};

export const ConfigSchema: JSONSchemaType<ConfigSchemaType> = {
  type: "object",
  properties: {
    chatGPTAPIToken: {
      type: "string",
      default: "",
    },
  },
  default: {},
  required: ["chatGPTAPIToken"],
};
