import { createApp } from 'vue'
import App from './popup/App.vue'
import './popup/styles/index.css'

// 全局错误处理
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  // 可以在这里添加错误上报逻辑
};

// 初始化应用
const app = createApp(App);

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, info);
  // 可以在这里添加错误上报逻辑
};

app.mount('#app'); 