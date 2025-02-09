<template>
  <div class="settings-container">
    <h2>设置</h2>
    
    <div class="setting-group">
      <h3>数据采集</h3>
      <div class="setting-item">
        <label>数据自动更新频率</label>
        <select v-model="settings.updateInterval">
          <option value="5">5分钟</option>
          <option value="15">15分钟</option>
          <option value="30">30分钟</option>
          <option value="60">1小时</option>
        </select>
      </div>

      <div class="setting-item">
        <label>数据存储时长</label>
        <select v-model="settings.storageTime">
          <option value="7">7天</option>
          <option value="30">30天</option>
          <option value="90">90天</option>
          <option value="180">180天</option>
        </select>
      </div>
    </div>

    <div class="setting-group">
      <h3>数据导出</h3>
      <div class="setting-item">
        <label>
          <input type="checkbox" v-model="settings.autoExport">
          启用自动导出
        </label>
      </div>

      <div class="setting-item" v-if="settings.autoExport">
        <label>导出格式</label>
        <select v-model="settings.exportFormat">
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
      </div>

      <div class="setting-item" v-if="settings.autoExport">
        <label>导出频率</label>
        <select v-model="settings.exportInterval">
          <option value="daily">每天</option>
          <option value="weekly">每周</option>
          <option value="monthly">每月</option>
        </select>
      </div>
    </div>

    <div class="setting-group">
      <h3>性能监控</h3>
      <div class="setting-item">
        <label>
          <input type="checkbox" v-model="settings.showPerformanceMonitor">
          显示性能监控
        </label>
      </div>
    </div>

    <div class="setting-actions">
      <button class="save-button" @click="saveSettings">保存设置</button>
      <button class="backup-button" @click="showBackup = true">数据备份</button>
    </div>

    <Backup v-if="showBackup" @close="showBackup = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Backup from './Backup.vue';

interface Settings {
  updateInterval: number;
  storageTime: number;
  autoExport: boolean;
  exportFormat: 'csv' | 'json';
  exportInterval: 'daily' | 'weekly' | 'monthly';
  showPerformanceMonitor: boolean;
}

export default defineComponent({
  name: 'Settings',
  components: {
    Backup
  },
  emits: ['settings-updated'],
  setup(props, { emit }) {
    const settings = ref<Settings>({
      updateInterval: 15,
      storageTime: 30,
      autoExport: false,
      exportFormat: 'csv',
      exportInterval: 'daily',
      showPerformanceMonitor: false
    });
    const showBackup = ref(false);

    onMounted(async () => {
      const stored = await chrome.storage.sync.get('settings');
      if (stored.settings) {
        settings.value = stored.settings;
      }
    });

    const saveSettings = async () => {
      try {
        await chrome.storage.sync.set({ settings: settings.value });
        emit('settings-updated', settings.value);
        chrome.runtime.sendMessage({
          type: 'SETTINGS_UPDATED',
          settings: settings.value
        });
      } catch (error) {
        console.error('保存设置失败:', error);
      }
    };

    return {
      settings,
      showBackup,
      saveSettings
    };
  }
});
</script>

<style scoped>
.settings-container {
  padding: 16px;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-group h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.setting-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.setting-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.save-button, .backup-button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.save-button {
  background-color: var(--primary-color);
  color: white;
}

.backup-button {
  background-color: #666;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style> 