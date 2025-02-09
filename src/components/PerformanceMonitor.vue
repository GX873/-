<template>
  <div class="performance-monitor">
    <h3>性能监控</h3>
    <div class="metrics-container">
      <div v-for="(metric, name) in metrics" :key="name" class="metric-item">
        <div class="metric-header">
          <span class="metric-name">{{ name }}</span>
          <span :class="['metric-status', getStatusClass(metric.avg)]"></span>
        </div>
        <div class="metric-details">
          <div class="metric-value">
            <span>平均: {{ formatValue(metric.avg) }}ms</span>
          </div>
          <div class="metric-range">
            <span>最小: {{ formatValue(metric.min) }}ms</span>
            <span>最大: {{ formatValue(metric.max) }}ms</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { PerformanceMonitor } from '@/utils/performance/monitor';

export default defineComponent({
  name: 'PerformanceMonitor',
  setup() {
    const monitor = PerformanceMonitor.getInstance();
    const metrics = ref<Record<string, any>>({});
    let updateInterval: number;

    const updateMetrics = () => {
      const allMetrics = [
        'dataProcessing',
        'renderTime',
        'domOperations',
        'apiCalls'
      ];

      metrics.value = allMetrics.reduce((acc, name) => {
        acc[name] = monitor.getMetrics(name);
        return acc;
      }, {} as Record<string, any>);
    };

    const formatValue = (value: number): string => {
      return value.toFixed(2);
    };

    const getStatusClass = (value: number): string => {
      if (value < 100) return 'status-good';
      if (value < 300) return 'status-warning';
      return 'status-error';
    };

    onMounted(() => {
      updateMetrics();
      updateInterval = window.setInterval(updateMetrics, 5000);
    });

    onUnmounted(() => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    });

    return {
      metrics,
      formatValue,
      getStatusClass
    };
  }
});
</script>

<style scoped>
.performance-monitor {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.metrics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.metric-item {
  background: white;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.metric-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-good {
  background-color: var(--success-color);
}

.status-warning {
  background-color: var(--warning-color);
}

.status-error {
  background-color: var(--error-color);
}

.metric-details {
  font-size: 12px;
  color: #666;
}

.metric-range {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}
</style> 