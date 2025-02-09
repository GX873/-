import { VideoData } from '../types';

export class ImportService {
  static async importFromCSV(file: File): Promise<VideoData[]> {
    try {
      const content = await this.readFile(file);
      const lines = content.split('\n');
      const headers = lines[0].split(',');
      
      return lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          id: values[0],
          title: values[1],
          playCount: parseInt(values[2]),
          likeCount: parseInt(values[3]),
          commentCount: parseInt(values[4]),
          shareCount: parseInt(values[5]),
          watchCompleteRate: parseFloat(values[6]),
          publishTime: values[7]
        };
      });
    } catch (error) {
      console.error('导入CSV失败:', error);
      throw error;
    }
  }

  static async importFromJSON(file: File): Promise<VideoData[]> {
    try {
      const content = await this.readFile(file);
      const data = JSON.parse(content);
      
      if (!Array.isArray(data)) {
        throw new Error('无效的JSON格式');
      }

      return data;
    } catch (error) {
      console.error('导入JSON失败:', error);
      throw error;
    }
  }

  private static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
} 