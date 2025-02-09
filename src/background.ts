import { VideoData, AccountAnalysis } from './types';

class BackgroundService {
  constructor() {
    this.initListeners();
  }

  private initListeners(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'DATA_COLLECTED') {
        this.handleCollectedData(message.data);
      } else if (message.type === 'GET_ACCOUNT_DATA') {
        // 返回测试数据
        sendResponse({
          basicInfo: {
            track: '生活',
            nickname: '测试账号',
            description: '这是一个测试账号的简介',
            homepage: 'https://channels.weixin.qq.com/platform'
          },
          accountStats: {
            likes: 100000,
            favorites: 50000,
            followers: 20000,
            totalVideos: 100,
            viralVideos: 10,
            viralRate: 10
          },
          accountPosition: {
            positioning: '生活分享',
            persona: '邻家大姐姐',
            audience: '18-35岁女性'
          },
          periodStats: {
            days: 30,
            publishedVideos: 30,
            totalInteractions: 50000,
            viralVideosCount: 5,
            recentViralRate: 16.7,
            viralVideoStats: {
              likes: 20000,
              favorites: 10000,
              comments: 5000
            }
          }
        });
        return true; // 保持消息通道开启
      }
    });
  }

  private async handleCollectedData(data: VideoData[]): Promise<void> {
    try {
      // 存储数据
      await this.saveData(data);
      
      // 发送通知（添加错误处理）
      try {
        await this.sendNotification('数据更新', '新的视频数据已收集完成');
      } catch (notificationError) {
        console.warn('通知发送失败:', notificationError);
      }
    } catch (error) {
      console.error('数据处理错误:', error);
    }
  }

  private async saveData(data: VideoData[]): Promise<void> {
    const storage = await chrome.storage.local.get('videoData');
    const existingData = storage.videoData || [];
    
    // 合并新旧数据，去重
    const mergedData = [...existingData, ...data].filter((value, index, self) =>
      index === self.findIndex((t) => t.id === value.id)
    );

    await chrome.storage.local.set({ videoData: mergedData });
  }

  private async sendNotification(title: string, message: string): Promise<void> {
    if (chrome.notifications) {
      return new Promise((resolve, reject) => {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icon128.png',
          title,
          message
        }, (notificationId) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } else {
      console.log('通知功能不可用:', title, message);
    }
  }
}

// 初始化后台服务
new BackgroundService(); 