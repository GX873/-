import { VideoData } from '../types';

export class ExportService {
  // 导出为CSV
  static exportToCSV(data: VideoData[]): string {
    const headers = ['标题', '播放量', '点赞数', '评论数', '分享数', '完成率', '发布时间'];
    const rows = data.map(video => [
      video.title,
      video.playCount,
      video.likeCount,
      video.commentCount,
      video.shareCount,
      video.watchCompleteRate,
      video.publishTime
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }

  // 导出为JSON
  static exportToJSON(data: VideoData[]): string {
    return JSON.stringify(data, null, 2);
  }

  // 下载文件
  static downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
} 