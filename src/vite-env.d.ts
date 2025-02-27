/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Polyfills for Node.js globals needed by simple-peer
declare global {
  interface Window {
    global: Window;
    process: {
      env: Record<string, string>;
      browser: boolean;
    };
    mockSocketRegistry: {
      sockets: Map<string, any>;
      broadcast: (event: string, data: any, senderId: string) => void;
    };
  }
  
  var Buffer: typeof import('buffer').Buffer;
  var process: {
    env: Record<string, string>;
    browser: boolean;
  };
}