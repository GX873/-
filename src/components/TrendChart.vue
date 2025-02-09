<template>
  <div class="trend-chart" ref="chartRef"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { VideoData } from '../types';

export default defineComponent({
  name: 'TrendChart',
  props: {
    data: {
      type: Array as () => VideoData[],
      required: true
    }
  },
  setup(props) {
    const chartRef = ref<HTMLElement | null>(null);
    let chart: echarts.ECharts | null = null;

    const initChart = () => {
      if (!chartRef.value) return;
      chart = echarts.init(chartRef.value);
    };

    const updateChart = () => {
      if (!chart) return;

      const dates = props.data.map(item => item.publishTime.split('T')[0]);
      const playData = props.data.map(item => item.playCount);
      const likeData = props.data.map(item => item.likeCount);

      chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['播放量', '点赞数']
        },
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '播放量',
            type: 'line',
            data: playData,
            smooth: true
          },
          {
            name: '点赞数',
            type: 'line',
            data: likeData,
            smooth: true
          }
        ]
      });
    };

    onMounted(() => {
      initChart();
      updateChart();
    });

    watch(() => props.data, () => {
      updateChart();
    }, { deep: true });

    return {
      chartRef
    };
  }
});
</script>

<style scoped>
.trend-chart {
  width: 100%;
  height: 300px;
}
</style> 