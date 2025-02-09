<template>
  <div class="analytics-report">
    <h2>数据分析报表</h2>
    <div class="report-section">
      <h3>总体数据</h3>
      <div class="metrics-grid">
        <div class="metric-card" v-for="metric in overallMetrics" :key="metric.label">
          <div class="metric-label">{{ metric.label }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-trend" :class="metric.trend">
            {{ metric.trendValue }}%
          </div>
        </div>
      </div>
    </div>

    <div class="report-section">
      <h3>最佳发布时间</h3>
      <div class="best-time">
        {{ bestPublishTime }}
      </div>
      <div class="time-chart" ref="timeChartRef"></div>
    </div>

    <div class="report-section">
      <h3>内容表现排行</h3>
      <div class="content-ranking">
        <div v-for="(item, index) in topContent" :key="index" class="ranking-item">
          <span class="rank">{{ index + 1 }}</span>
          <span class="title">{{ item.title }}</span>
          <span class="score">{{ item.score }}</span>
        </div>
      </div>
    </div>

    <div class="export-actions">
      <button @click="exportToExcel" class="export-button">
        导出 Excel 报表
      </button>
      <button @click="showDateRangePicker = true" class="export-button">
        导出自定义时间段
      </button>
    </div>

    <!-- 日期选择弹窗 -->
    <div v-if="showDateRangePicker" class="date-picker-modal">
      <div class="date-picker-content">
        <h3>选择时间范围</h3>
        <div class="date-inputs">
          <input type="date" v-model="startDate">
          <span>至</span>
          <input type="date" v-model="endDate">
        </div>
        <div class="modal-actions">
          <button @click="exportDateRange">确认导出</button>
          <button @click="showDateRangePicker = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { AnalyticsService } from '../utils/analytics';
import { ExportService } from '../utils/export';
import * as echarts from 'echarts';
import type { VideoData, AccountAnalysis } from '../types';
import { ExcelExport } from '../utils/excelExport';

export default defineComponent({
  name: 'AnalyticsReport',
  setup() {
    const videoData = ref<VideoData[]>([]);
    const timeChartRef = ref<HTMLElement | null>(null);
    let timeChart: echarts.ECharts | null = null;
    const showDateRangePicker = ref(false);
    const startDate = ref('');
    const endDate = ref('');

    const overallMetrics = computed(() => {
      if (!videoData.value.length) return [];
      
      const currentData = videoData.value;
      const previousData = videoData.value.slice(0, -1);

      const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
      };

      return [
        {
          label: '总播放量',
          value: currentData.reduce((sum, v) => sum + v.playCount, 0),
          trend: 'up',
          trendValue: calculateTrend(
            currentData.reduce((sum, v) => sum + v.playCount, 0),
            previousData.reduce((sum, v) => sum + v.playCount, 0)
          )
        },
        {
          label: '平均完成率',
          value: AnalyticsService.calculateAverageCompleteRate(currentData),
          trend: 'up',
          trendValue: calculateTrend(
            AnalyticsService.calculateAverageCompleteRate(currentData),
            AnalyticsService.calculateAverageCompleteRate(previousData)
          )
        }
      ];
    });

    const bestPublishTime = computed(() => {
      return AnalyticsService.analyzeBestPublishTime(videoData.value);
    });

    const topContent = computed(() => {
      return AnalyticsService.analyzeContentPerformance(videoData.value).slice(0, 5);
    });

    const initTimeChart = () => {
      if (!timeChartRef.value) return;
      timeChart = echarts.init(timeChartRef.value);
      updateTimeChart();
    };

    const updateTimeChart = () => {
      if (!timeChart) return;
      // 实现时间分布图表配置...
    };

    const exportReport = async () => {
      const report = AnalyticsService.generateReport(videoData.value);
      ExportService.downloadFile(
        report,
        `analytics_report_${new Date().toISOString().split('T')[0]}.txt`,
        'text/plain'
      );
    };

    const refreshData = async () => {
      const data = await chrome.storage.local.get('videoData');
      videoData.value = data.videoData || [];
      updateTimeChart();
    };

    const exportToExcel = async () => {
      try {
        // 获取实际的账号数据
        const accountData = await new Promise<AccountAnalysis>((resolve, reject) => {
          chrome.runtime.sendMessage({ type: 'GET_ACCOUNT_DATA' }, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
        
        ExcelExport.exportDailyAnalysis(accountData);
      } catch (error) {
        console.error('导出数据失败:', error);
      }
    };

    const exportDateRange = () => {
      if (startDate.value && endDate.value) {
        const filteredData = videoData.value.filter(item => {
          const date = item.publishTime.split('T')[0];
          return date >= startDate.value && date <= endDate.value;
        });
        ExcelExport.exportDateRangeReport(filteredData, startDate.value, endDate.value);
        showDateRangePicker.value = false;
      }
    };

    onMounted(() => {
      refreshData();
      initTimeChart();
    });

    return {
      overallMetrics,
      bestPublishTime,
      topContent,
      timeChartRef,
      exportReport,
      refreshData,
      showDateRangePicker,
      startDate,
      endDate,
      exportToExcel,
      exportDateRange
    };
  }
});
</script>

<style scoped>
.analytics-report {
  padding: 20px;
}

.report-section {
  margin-bottom: 24px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.metric-card {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
}

.metric-label {
  color: #666;
  font-size: 14px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin: 8px 0;
}

.metric-trend {
  font-size: 12px;
}

.metric-trend.up {
  color: var(--success-color);
}

.metric-trend.down {
  color: var(--error-color);
}

.time-chart {
  height: 300px;
  margin-top: 16px;
}

.content-ranking {
  margin-top: 16px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.rank {
  width: 30px;
  font-weight: bold;
}

.title {
  flex: 1;
  margin: 0 16px;
}

.score {
  font-weight: bold;
  color: var(--primary-color);
}

.export-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.export-button {
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.export-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.date-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-picker-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
}

.date-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 20px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style> 