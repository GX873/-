import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'

// 添加全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const app = createApp(App);

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error handler:', err, info);
};

app.mount('#app'); 