let configCache: any = null;

export async function fetchConfig(): Promise<any> {
  if (configCache) return configCache;

  const response = await fetch('/config.json');
  if (!response.ok) {
    throw new Error('Failed to load config');
  }

  const data = await response.json();
  configCache = data;
  return data;
}