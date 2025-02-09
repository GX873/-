import { PerformanceMonitor } from '@/utils/performance/monitor';

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private monitor: PerformanceMonitor;
  private readonly PERFORMANCE_THRESHOLD = {
    dataProcessing: 500, // 数据处理阈值（毫秒）
    renderTime: 100,     // 渲染时间阈值（毫秒）
    memoryUsage: 50      // 内存使用阈值（MB）
  };

  private constructor() {
    this.monitor = PerformanceMonitor.getInstance();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // 数据分批处理
  async processBatch<T>(
    items: T[],
    processor: (item: T) => Promise<void>,
    batchSize: number = 100
  ): Promise<void> {
    const batches = this.splitIntoBatches(items, batchSize);
    
    for (const batch of batches) {
      this.monitor.startMeasure('batchProcessing');
      await Promise.all(batch.map(processor));
      this.monitor.endMeasure('batchProcessing');
      
      // 检查性能并适应批处理大小
      this.adaptBatchSize(batchSize);
      
      // 给其他任务执行的机会
      await this.yieldToMain();
    }
  }

  // 分割数据为批次
  private splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  // 根据性能指标调整批处理大小
  private adaptBatchSize(currentBatchSize: number): number {
    const metrics = this.monitor.getMetrics('batchProcessing');
    
    if (metrics.avg > this.PERFORMANCE_THRESHOLD.dataProcessing) {
      return Math.max(10, currentBatchSize / 2);
    } else if (metrics.avg < this.PERFORMANCE_THRESHOLD.dataProcessing / 2) {
      return Math.min(1000, currentBatchSize * 1.5);
    }
    
    return currentBatchSize;
  }

  // 让出主线程
  private async yieldToMain(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  // 检查内存使用情况
  checkMemoryUsage(): boolean {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedHeapSize = memory.usedJSHeapSize / (1024 * 1024); // 转换为MB
      return usedHeapSize < this.PERFORMANCE_THRESHOLD.memoryUsage;
    }
    return true;
  }

  // 优化大量DOM操作
  optimizeDOMOperations<T>(
    items: T[],
    renderer: (item: T) => HTMLElement
  ): DocumentFragment {
    const fragment = document.createDocumentFragment();
    
    this.monitor.startMeasure('domOperations');
    items.forEach(item => {
      fragment.appendChild(renderer(item));
    });
    this.monitor.endMeasure('domOperations');
    
    return fragment;
  }

  // 防抖函数
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = window.setTimeout(() => {
        func.apply(null, args);
        timeout = null;
      }, wait);
    };
  }

  // 节流函数
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
} 