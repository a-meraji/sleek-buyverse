type LogLevel = 'info' | 'error' | 'success';

const logWithLevel = (level: LogLevel, message: string, data?: any) => {
  const logFn = level === 'error' ? console.error : console.log;
  if (data) {
    logFn(`[Chat ${level}] ${message}:`, data);
  } else {
    logFn(`[Chat ${level}] ${message}`);
  }
};

export const chatLogger = {
  info: (message: string, data?: any) => logWithLevel('info', message, data),
  error: (message: string, data?: any) => logWithLevel('error', message, data),
  success: (message: string, data?: any) => logWithLevel('success', message, data),
};