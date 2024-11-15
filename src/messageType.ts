export type InjectMessageType = {
  readUserName(): Promise<string>;
  setUserName(name: string): Promise<void>;
};

export type BackgroundMessageType = {};
