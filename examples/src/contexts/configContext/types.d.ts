interface IConfig {
  apiKey: string;
}

interface IConfigContext {
  config: IConfig;
  modifyConfig: (key: keyof IConfig, value: string) => IConfig;
}