import { ConfigSchema, ConfigSchemaType } from "./config";

export type SchemaType = {
  config: ConfigSchemaType;
};

export const schema = {
  config: ConfigSchema,
};
