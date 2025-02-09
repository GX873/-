import { VideoData } from '../types';

export class AnalyticsService {
  // 计算视频平均观看完成率
  static calculateAverageCompleteRate(videos: VideoData[]): number {
    if (!videos.length) return 0;
    const sum = videos.reduce((acc, video) => acc + video.watchCompleteRate, 0);
    return Number((sum / videos.length).toFixed(2));
  }

  // 计算最佳发布时间
  static analyzeBestPublishTime(videos: VideoData[]): string {
    const timeStats = new Map<number, { count: number; engagement: number }>();
    
    videos.forEach(video => {
      const publishHour = new Date(video.publishTime).getHours();
      const engagement = video.playCount + video.likeCount * 2 + video.commentCount * 3;
      
      const current = timeStats.get(publishHour) || { count: 0, engagement: 0 };
      timeStats.set(publishHour, {
        count: current.count + 1,
        engagement: current.engagement + engagement
      });
    });

    let bestHour = 0;
    let bestEngagement = 0;

    timeStats.forEach((stats, hour) => {
      const avgEngagement = stats.engagement / stats.count;
      if (avgEngagement > bestEngagement) {
        bestEngagement = avgEngagement;
        bestHour = hour;
      }
    });

    return `${bestHour}:00`;
  }

  // 分析内容表现
  static analyzeContentPerformance(videos: VideoData[]): {
    title: string;
    score: number;
  }[] {
    return videos.map(video => {
      const score = (
        video.playCount +
        video.likeCount * 2 +
        video.commentCount * 3 +
        video.shareCount * 4
      ) * (video.watchCompleteRate / 100);

      return {
        title: video.title,
        score: Number(score.toFixed(2))
      };
    }).sort((a, b) => b.score - a.score);
  }

  // 生成数据报表
  static generateReport(videos: VideoData[]): string {
    const totalViews = videos.reduce((sum, video) => sum + video.playCount, 0);
    const totalLikes = videos.reduce((sum, video) => sum + video.likeCount, 0);
    const totalComments = videos.reduce((sum, video) => sum + video.commentCount, 0);
    const avgCompleteRate = this.calculateAverageCompleteRate(videos);
    const bestTime = this.analyzeBestPublishTime(videos);

    return `
数据报表摘要：
- 总播放量：${totalViews}
- 总点赞数：${totalLikes}
- 总评论数：${totalComments}
- 平均完成率：${avgCompleteRate}%
- 最佳发布时间：${bestTime}
    `.trim();
  }
} 