import { extId } from "@/const";
import { InjectMessageType, BackgroundMessageType } from "@/messageType";
import { schema, SchemaType } from "@/schema/index";
import { MessageInstance } from "@webextkits/messages-center/background";
import { useStorageLocal } from "@webextkits/storage-local";

const mc = new MessageInstance<InjectMessageType, BackgroundMessageType>(
  extId,
  true,
);

const { updateBucket, setBucket, getBucket, deleteBucket } =
  useStorageLocal<SchemaType>(schema);

export function useMessages() {
  mc.on("readUserName", async () => {
    const user = await getBucket("user");
    return user.name;
  });

  mc.on("setUserName", (name: string) => {
    return updateBucket("user", (bucket) => {
      bucket.name = name;
      return bucket;
    });
  });
}
