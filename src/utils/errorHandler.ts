import { ErrorLevel, ErrorLog } from '@/types';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private readonly MAX_LOGS = 1000;
  private logs: ErrorLog[] = [];

  private constructor() {
    this.initGlobalHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private initGlobalHandlers(): void {
    // 全局错误处理
    window.onerror = (message, source, lineno, colno, error) => {
      this.logError('error', message as string, error);
    };

    // Promise 错误处理
    window.onunhandledrejection = (event) => {
      this.logError('error', 'Unhandled Promise Rejection', event.reason);
    };
  }

  logError(level: ErrorLevel, message: string, error?: Error | any, context?: any): void {
    const errorLog: ErrorLog = {
      level,
      message,
      timestamp: Date.now(),
      context,
      stack: error?.stack
    };

    this.logs.push(errorLog);
    this.trimLogs();
    this.persistLog(errorLog);
    this.notifyError(errorLog);
  }

  private trimLogs(): void {
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }
  }

  private async persistLog(log: ErrorLog): Promise<void> {
    try {
      const { logs } = await chrome.storage.local.get('errorLogs');
      const errorLogs = logs || [];
      errorLogs.push(log);
      await chrome.storage.local.set({ errorLogs });
    } catch (error) {
      console.error('Failed to persist error log:', error);
    }
  }

  private notifyError(log: ErrorLog): void {
    if (log.level === 'error' || log.level === 'fatal') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon128.png',
        title: '发生错误',
        message: log.message
      });
    }
  }

  async getLogs(level?: ErrorLevel): Promise<ErrorLog[]> {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  }

  async clearLogs(): Promise<void> {
    this.logs = [];
    await chrome.storage.local.remove('errorLogs');
  }
} 