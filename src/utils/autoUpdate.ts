import { CacheService } from './cache';
import { VideoData } from '../types';

export class AutoUpdateService {
  private static instance: AutoUpdateService;
  private updateInterval: number = 15; // 默认15分钟
  private timer: number | null = null;

  private constructor() {}

  static getInstance(): AutoUpdateService {
    if (!AutoUpdateService.instance) {
      AutoUpdateService.instance = new AutoUpdateService();
    }
    return AutoUpdateService.instance;
  }

  // 开始自动更新
  startAutoUpdate(interval: number): void {
    this.stopAutoUpdate();
    this.updateInterval = interval;
    
    this.timer = window.setInterval(() => {
      this.performUpdate();
    }, this.updateInterval * 60 * 1000);
  }

  // 停止自动更新
  stopAutoUpdate(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  // 执行更新
  private async performUpdate(): Promise<void> {
    try {
      // 发送消息给content script获取新数据
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'REQUEST_DATA_UPDATE' });
        }
      });
    } catch (error) {
      console.error('执行自动更新失败:', error);
    }
  }
} 