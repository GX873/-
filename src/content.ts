// 数据采集脚本
class DataCollector {
  private static instance: DataCollector;
  private observer: MutationObserver | null = null;
  private retryCount = 0;
  private readonly MAX_RETRIES = 3;

  private constructor() {
    this.initObserver();
    // 添加页面卸载时的清理
    window.addEventListener('unload', () => {
      this.cleanup();
    });
  }

  public static getInstance(): DataCollector {
    if (!DataCollector.instance) {
      DataCollector.instance = new DataCollector();
    }
    return DataCollector.instance;
  }

  private initObserver(): void {
    try {
      this.observer = new MutationObserver(() => {
        this.collectData();
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (error) {
      console.error('初始化观察器失败:', error);
    }
  }

  private cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private async collectData(): Promise<void> {
    try {
      const videoElements = document.querySelectorAll('.video-item');
      const data = Array.from(videoElements).map(element => ({
        id: element.getAttribute('data-id') || '',
        title: element.querySelector('.title')?.textContent || '',
        playCount: this.extractNumber(element.querySelector('.play-count')),
        likeCount: this.extractNumber(element.querySelector('.like-count')),
        commentCount: this.extractNumber(element.querySelector('.comment-count')),
        shareCount: this.extractNumber(element.querySelector('.share-count')),
        watchCompleteRate: this.extractNumber(element.querySelector('.complete-rate')),
        publishTime: element.querySelector('.publish-time')?.getAttribute('datetime') || ''
      }));

      if (data.length > 0) {
        await this.sendMessageWithRetry({
          type: 'DATA_COLLECTED',
          data
        });
      }
    } catch (error) {
      console.error('数据采集错误:', error);
    }
  }

  private async sendMessageWithRetry(message: any): Promise<void> {
    try {
      await chrome.runtime.sendMessage(message);
      this.retryCount = 0; // 重置重试计数
    } catch (error) {
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        console.warn(`发送消息失败，正在重试 (${this.retryCount}/${this.MAX_RETRIES})`);
        setTimeout(() => {
          this.sendMessageWithRetry(message);
        }, 1000 * this.retryCount); // 递增重试延迟
      } else {
        console.error('发送消息最终失败:', error);
        this.retryCount = 0;
      }
    }
  }

  private extractNumber(element: Element | null): number {
    if (!element) return 0;
    const text = element.textContent || '';
    return parseInt(text.replace(/[^0-9]/g, '')) || 0;
  }

  private async collectAccountData(): Promise<AccountAnalysis> {
    try {
      // 获取页面上的数据
      const basicInfo = {
        track: document.querySelector('.creator-info .track')?.textContent?.trim() || '',
        nickname: document.querySelector('.creator-info .nickname')?.textContent?.trim() || '',
        description: document.querySelector('.creator-info .description')?.textContent?.trim() || '',
        homepage: window.location.href
      };

      const accountStats = {
        likes: this.extractNumber(document.querySelector('.stats .likes-count')),
        favorites: this.extractNumber(document.querySelector('.stats .favorites-count')),
        followers: this.extractNumber(document.querySelector('.stats .followers-count')),
        totalVideos: this.extractNumber(document.querySelector('.stats .videos-count')),
        viralVideos: this.extractNumber(document.querySelector('.stats .viral-count')),
        viralRate: this.extractNumber(document.querySelector('.stats .viral-rate'))
      };

      const accountPosition = {
        positioning: document.querySelector('.position .type')?.textContent?.trim() || '',
        persona: document.querySelector('.position .persona')?.textContent?.trim() || '',
        audience: document.querySelector('.position .audience')?.textContent?.trim() || ''
      };

      const periodStats = {
        days: 30, // 默认30天
        publishedVideos: this.extractNumber(document.querySelector('.period-stats .published-count')),
        totalInteractions: this.extractNumber(document.querySelector('.period-stats .interactions-count')),
        viralVideosCount: this.extractNumber(document.querySelector('.period-stats .viral-count')),
        recentViralRate: this.extractNumber(document.querySelector('.period-stats .viral-rate')),
        viralVideoStats: {
          likes: this.extractNumber(document.querySelector('.viral-stats .likes-count')),
          favorites: this.extractNumber(document.querySelector('.viral-stats .favorites-count')),
          comments: this.extractNumber(document.querySelector('.viral-stats .comments-count'))
        }
      };

      return {
        basicInfo,
        accountStats,
        accountPosition,
        periodStats
      };
    } catch (error) {
      console.error('采集账号数据失败:', error);
      throw error;
    }
  }
}

// 初始化数据采集器
DataCollector.getInstance(); 