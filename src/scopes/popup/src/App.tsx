import { schema, SchemaType } from "@/schema";
import { useStorageLocal } from "@webextkits/storage-local";
import { Input, Button, message } from "antd";
import { useEffect, useState } from "react";

const { updateBucket, setBucket, getBucket, deleteBucket } =
  useStorageLocal<SchemaType>(schema);

export function App() {
  const [name, setName] = useState("");

  useEffect(() => {
    getBucket("user").then((data) => {
      setName(data.name);
    });
  }, []);

  return (
    <div>
      <Input
        type="text"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      Your name: {name}
      <Button
        type={"primary"}
        block={true}
        onClick={async () => {
          await updateBucket("user", (bucket) => {
            bucket.name = name;
            return bucket;
          });

          message.success("更新成功");
        }}
      >
        保存
      </Button>
    </div>
  );
}
