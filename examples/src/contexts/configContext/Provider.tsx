import usePersistedState from "@/hooks/usePresistedState";
import configContext from ".";

const Provider = configContext.Provider;

export default function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = usePersistedState<IConfig>('config', {
    apiKey: '',
  });

  const modifyConfig = (key: keyof IConfig, value: string) => {
    const newState = { ...config, [key]: value }
    setConfig(newState);
    return newState;
  };

  return (
    <Provider value={{ config, modifyConfig }}>
      {children}
    </Provider>
  );
}