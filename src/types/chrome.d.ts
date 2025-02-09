/// <reference types="chrome"/>

declare namespace chrome {
  export const storage: {
    local: {
      get(keys: string | string[] | null): Promise<{ [key: string]: any }>;
      set(items: { [key: string]: any }): Promise<void>;
    };
    sync: {
      get(keys: string | string[] | null): Promise<{ [key: string]: any }>;
      set(items: { [key: string]: any }): Promise<void>;
    };
  };
  
  export const tabs: {
    query(queryInfo: {
      active: boolean;
      currentWindow: boolean;
    }): Promise<chrome.tabs.Tab[]>;
    sendMessage(tabId: number, message: any): Promise<any>;
  };
} 