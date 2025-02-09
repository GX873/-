export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {
    this.initPerformanceObserver();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initPerformanceObserver(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric(entry.name, entry.duration);
      });
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string): void {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  private recordMetric(name: string, value: number): void {
    const metrics = this.metrics.get(name) || [];
    metrics.push(value);
    this.metrics.set(name, metrics);
  }

  getMetrics(name: string): {
    avg: number;
    min: number;
    max: number;
    count: number;
  } {
    const metrics = this.metrics.get(name) || [];
    if (metrics.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0 };
    }

    return {
      avg: metrics.reduce((a, b) => a + b, 0) / metrics.length,
      min: Math.min(...metrics),
      max: Math.max(...metrics),
      count: metrics.length
    };
  }
} 