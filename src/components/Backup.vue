<template>
  <div class="backup-container">
    <h2>数据备份</h2>
    <div class="backup-actions">
      <button @click="createBackup" :disabled="isProcessing">
        {{ isProcessing ? '备份中...' : '创建备份' }}
      </button>
      <div class="restore-section">
        <input
          type="file"
          ref="fileInput"
          accept=".json"
          @change="handleFileSelect"
          style="display: none"
        >
        <button @click="triggerFileSelect" :disabled="isProcessing">
          恢复备份
        </button>
      </div>
    </div>
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BackupService } from '../utils/backup';

export default defineComponent({
  name: 'Backup',
  setup() {
    const isProcessing = ref(false);
    const message = ref('');
    const messageType = ref<'success' | 'error'>('success');
    const fileInput = ref<HTMLInputElement | null>(null);

    const createBackup = async () => {
      isProcessing.value = true;
      message.value = '';
      
      try {
        await BackupService.createBackup();
        message.value = '备份创建成功！';
        messageType.value = 'success';
      } catch (error) {
        message.value = '备份创建失败：' + (error as Error).message;
        messageType.value = 'error';
      } finally {
        isProcessing.value = false;
      }
    };

    const triggerFileSelect = () => {
      fileInput.value?.click();
    };

    const handleFileSelect = async (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      isProcessing.value = true;
      message.value = '';

      try {
        await BackupService.restoreBackup(files[0]);
        message.value = '备份恢复成功！';
        messageType.value = 'success';
      } catch (error) {
        message.value = '备份恢复失败：' + (error as Error).message;
        messageType.value = 'error';
      } finally {
        isProcessing.value = false;
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }
    };

    return {
      isProcessing,
      message,
      messageType,
      fileInput,
      createBackup,
      triggerFileSelect,
      handleFileSelect
    };
  }
});
</script>

<style scoped>
.backup-container {
  padding: 16px;
}

.backup-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

button {
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message {
  margin-top: 16px;
  padding: 8px;
  border-radius: 4px;
}

.message.success {
  background-color: var(--success-color);
  color: white;
}

.message.error {
  background-color: var(--error-color);
  color: white;
}
</style> 