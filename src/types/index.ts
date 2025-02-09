// 定义数据类型接口
export interface VideoData {
  id: string;
  title: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  watchCompleteRate: number;
  publishTime: string;
}

export interface AnalyticsData {
  dailyData: VideoData[];
  weeklyData: VideoData[];
  monthlyData: VideoData[];
}

export type ErrorLevel = 'info' | 'warning' | 'error' | 'fatal';

export interface ErrorLog {
  level: ErrorLevel;
  message: string;
  timestamp: number;
  context?: any;
  stack?: string;
}

// 基础信息
export interface BasicInfo {
  track: string;      // 赛道
  nickname: string;   // 昵称
  description: string;// 简介
  homepage: string;   // 主页链接
}

// 账号数据
export interface AccountStats {
  likes: number;      // 总点赞数
  favorites: number;  // 总收藏数
  followers: number;  // 粉丝数
  totalVideos: number;// 作品数
  viralVideos: number;// 爆文数
  viralRate: number;  // 爆文率
}

// 账号定位
export interface AccountPosition {
  positioning: string;// 定位
  persona: string;    // 人设
  audience: string;   // 受众人群
}

// N天数据
export interface PeriodStats {
  days: number;           // 统计天数
  publishedVideos: number;// 发布作品数
  totalInteractions: number;// 作品总互动
  viralVideosCount: number;// 爆款作品数
  recentViralRate: number;// 最近爆文率
  viralVideoStats: {      // 爆款作品数据
    likes: number;        // 点赞数
    favorites: number;    // 收藏数
    comments: number;     // 评论数
  };
}

// 完整的账号分析数据
export interface AccountAnalysis {
  basicInfo: BasicInfo;
  accountStats: AccountStats;
  accountPosition: AccountPosition;
  periodStats: PeriodStats;
} 