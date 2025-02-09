import * as XLSX from 'xlsx';
import type { AccountAnalysis } from '../types';

export class ExcelExport {
  static exportAccountAnalysis(data: AccountAnalysis, filename: string): void {
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 准备数据
    const worksheetData = [
      // 基础信息
      ['基础信息', '', ''],
      ['', '赛道', data.basicInfo.track],
      ['', '昵称', data.basicInfo.nickname],
      ['', '简介', data.basicInfo.description],
      ['', '主页', data.basicInfo.homepage],
      ['', '', ''],
      
      // 账号数据
      ['账号数据', '', ''],
      ['', '点赞数', data.accountStats.likes],
      ['', '收藏数', data.accountStats.favorites],
      ['', '粉丝数', data.accountStats.followers],
      ['', '作品数', data.accountStats.totalVideos],
      ['', '爆文数', data.accountStats.viralVideos],
      ['', '爆文率', `${data.accountStats.viralRate}%`],
      ['', '', ''],
      
      // 账号定位
      ['账号定位', '', ''],
      ['', '定位', data.accountPosition.positioning],
      ['', '人设', data.accountPosition.persona],
      ['', '受众人群', data.accountPosition.audience],
      ['', '', ''],
      
      // N天数据
      [`${data.periodStats.days}天数据`, '', ''],
      ['', '发布作品数', data.periodStats.publishedVideos],
      ['', '作品总互动', data.periodStats.totalInteractions],
      ['', '爆款作品数', data.periodStats.viralVideosCount],
      ['', '最近爆文率', `${data.periodStats.recentViralRate}%`],
      ['爆款作品数据', '', ''],
      ['', '点赞数', data.periodStats.viralVideoStats.likes],
      ['', '收藏数', data.periodStats.viralVideoStats.favorites],
      ['', '评论数', data.periodStats.viralVideoStats.comments]
    ];

    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // 设置列宽
    ws['!cols'] = [
      { wch: 20 }, // A列 - 大分类
      { wch: 15 }, // B列 - 小分类
      { wch: 30 }, // C列 - 数据
    ];

    // 设置样式
    const sectionStyles = {
      '基础信息': { fill: { fgColor: { rgb: "E2EFDA" } }, font: { bold: true } },
      '账号数据': { fill: { fgColor: { rgb: "FCE4D6" } }, font: { bold: true } },
      '账号定位': { fill: { fgColor: { rgb: "DEEBF7" } }, font: { bold: true } },
      [`${data.periodStats.days}天数据`]: { fill: { fgColor: { rgb: "E7E6E6" } }, font: { bold: true } },
      '爆款作品数据': { fill: { fgColor: { rgb: "FFF2CC" } }, font: { bold: true } }
    };

    // 合并大分类单元格
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },  // 基础信息
      { s: { r: 6, c: 0 }, e: { r: 6, c: 2 } },  // 账号数据
      { s: { r: 14, c: 0 }, e: { r: 14, c: 2 } }, // 账号定位
      { s: { r: 19, c: 0 }, e: { r: 19, c: 2 } }, // N天数据
      { s: { r: 25, c: 0 }, e: { r: 25, c: 2 } }  // 爆款作品数据
    ];
    ws['!merges'] = merges;

    // 应用样式
    for (let i = 0; i < worksheetData.length; i++) {
      const cell = worksheetData[i][0];
      if (sectionStyles[cell]) {
        // 设置整行的样式
        ['A', 'B', 'C'].forEach(col => {
          const cellRef = `${col}${i + 1}`;
          if (!ws[cellRef]) ws[cellRef] = { v: '', s: {} };
          ws[cellRef].s = {
            ...sectionStyles[cell],
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        });
      }
    }

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '账号分析');

    // 导出文件
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  static exportDailyAnalysis(data: AccountAnalysis): void {
    const today = new Date().toISOString().split('T')[0];
    this.exportAccountAnalysis(data, `账号分析报表_${today}`);
  }
} 