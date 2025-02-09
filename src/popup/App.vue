<template>
  <div class="popup-container">
    <header class="header">
      <h1>视频号数据分析</h1>
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
    </header>

    <main class="content">
      <div v-if="currentTab === 'overview'" class="overview">
        <div class="data-card">
          <h3>今日数据</h3>
          <div class="metrics">
            <div class="metric">
              <span class="label">播放量</span>
              <span class="value">{{ todayStats.playCount }}</span>
            </div>
            <div class="metric">
              <span class="label">点赞数</span>
              <span class="value">{{ todayStats.likeCount }}</span>
            </div>
            <div class="metric">
              <span class="label">评论数</span>
              <span class="value">{{ todayStats.commentCount }}</span>
            </div>
          </div>
        </div>
        <TrendChart :data="chartData" />
      </div>

      <div v-else-if="currentTab === 'analysis'" class="analysis">
        <AnalyticsReport />
      </div>

      <div v-else-if="currentTab === 'settings'" class="settings">
        <Settings @settings-updated="handleSettingsUpdate" />
      </div>
    </main>

    <PerformanceMonitor v-if="showPerformance" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import TrendChart from '../components/TrendChart.vue';
import AnalyticsReport from '../components/AnalyticsReport.vue';
import Settings from '../components/Settings.vue';
import PerformanceMonitor from '../components/PerformanceMonitor.vue';
import type { VideoData } from '../types';

export default defineComponent({
  name: 'App',
  components: {
    TrendChart,
    AnalyticsReport,
    Settings,
    PerformanceMonitor
  },
  setup() {
    const currentTab = ref('overview');
    const videoData = ref<VideoData[]>([]);
    const showPerformance = ref(false);

    const tabs = [
      { id: 'overview', name: '概览' },
      { id: 'analysis', name: '分析' },
      { id: 'settings', name: '设置' }
    ];

    const todayStats = computed(() => {
      const today = new Date().toISOString().split('T')[0];
      const todayData = videoData.value.filter(
        item => item.publishTime.startsWith(today)
      );

      return {
        playCount: todayData.reduce((sum, item) => sum + item.playCount, 0),
        likeCount: todayData.reduce((sum, item) => sum + item.likeCount, 0),
        commentCount: todayData.reduce((sum, item) => sum + item.commentCount, 0)
      };
    });

    const chartData = computed(() => {
      // 按日期排序
      return [...videoData.value].sort(
        (a, b) => new Date(a.publishTime).getTime() - new Date(b.publishTime).getTime()
      );
    });

    const loadData = async () => {
      try {
        const storage = await chrome.storage.local.get('videoData');
        videoData.value = storage.videoData || [];
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };

    const handleSettingsUpdate = async (newSettings: any) => {
      try {
        showPerformance.value = newSettings.showPerformanceMonitor;
        // 其他设置更新逻辑...
      } catch (error) {
        console.error('更新设置失败:', error);
      }
    };

    onMounted(async () => {
      await loadData();
      // 监听数据更新
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.videoData) {
          videoData.value = changes.videoData.newValue || [];
        }
      });
    });

    return {
      currentTab,
      tabs,
      todayStats,
      chartData,
      showPerformance,
      handleSettingsUpdate
    };
  }
});
</script>

<style scoped>
.popup-container {
  width: 800px;
  min-height: 600px;
  padding: 20px;
  background: #f0f2f5;
}

.header {
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.tabs {
  display: flex;
  gap: 12px;
}

.data-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 16px;
}

.metric {
  text-align: center;
  padding: 16px;
  background: #f6f8fa;
  border-radius: 8px;
  transition: transform 0.3s;
}

.metric:hover {
  transform: translateY(-2px);
}

.metric .label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.metric .value {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 1200px) {
  .popup-container {
    width: 600px;
  }
  
  .content {
    grid-template-columns: 1fr;
  }
}
</style> 