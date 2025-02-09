import { VideoData } from '../types';
import { ExportService } from './export';

export class BackupService {
  private static readonly BACKUP_KEY = 'lastBackup';

  // 创建备份
  static async createBackup(): Promise<void> {
    try {
      const data = await chrome.storage.local.get('videoData');
      const backupData = {
        timestamp: Date.now(),
        data: data.videoData || []
      };

      // 保存备份到chrome.storage.sync
      await chrome.storage.sync.set({
        [this.BACKUP_KEY]: backupData
      });

      // 导出备份文件
      const jsonData = JSON.stringify(backupData, null, 2);
      const date = new Date().toISOString().split('T')[0];
      ExportService.downloadFile(
        jsonData,
        `video_data_backup_${date}.json`,
        'application/json'
      );
    } catch (error) {
      console.error('创建备份失败:', error);
      throw error;
    }
  }

  // 恢复备份
  static async restoreBackup(backupFile: File): Promise<void> {
    try {
      const fileContent = await this.readBackupFile(backupFile);
      const backupData = JSON.parse(fileContent);

      // 验证备份数据格式
      if (!this.validateBackupData(backupData)) {
        throw new Error('无效的备份文件格式');
      }

      // 恢复数据
      await chrome.storage.local.set({ videoData: backupData.data });
    } catch (error) {
      console.error('恢复备份失败:', error);
      throw error;
    }
  }

  // 读取备份文件
  private static readBackupFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  // 验证备份数据格式
  private static validateBackupData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.data) &&
      typeof data.timestamp === 'number'
    );
  }
} 