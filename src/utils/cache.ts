import { VideoData } from '../types';

export class CacheService {
  private static readonly CACHE_KEY = 'videoDataCache';
  private static readonly CACHE_TIMESTAMP_KEY = 'cacheTimestamp';

  // 保存数据到缓存
  static async cacheData(data: VideoData[]): Promise<void> {
    try {
      await chrome.storage.local.set({
        [this.CACHE_KEY]: data,
        [this.CACHE_TIMESTAMP_KEY]: Date.now()
      });
    } catch (error) {
      console.error('缓存数据失败:', error);
    }
  }

  // 从缓存获取数据
  static async getCachedData(): Promise<VideoData[]> {
    try {
      const result = await chrome.storage.local.get([this.CACHE_KEY, this.CACHE_TIMESTAMP_KEY]);
      return result[this.CACHE_KEY] || [];
    } catch (error) {
      console.error('获取缓存数据失败:', error);
      return [];
    }
  }

  // 清理过期数据
  static async cleanExpiredData(storageTime: number): Promise<void> {
    try {
      const data = await this.getCachedData();
      const expirationTime = storageTime * 24 * 60 * 60 * 1000; // 转换为毫秒
      const now = Date.now();
      
      const validData = data.filter(item => {
        const itemTime = new Date(item.publishTime).getTime();
        return now - itemTime < expirationTime;
      });

      await this.cacheData(validData);
    } catch (error) {
      console.error('清理过期数据失败:', error);
    }
  }
} 