declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export default global;
