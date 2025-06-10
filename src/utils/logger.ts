
// Simple logger utility for debugging
export const logger = {
  error: (...args: any[]) => {
    console.error('[EduEasy Error]:', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[EduEasy Warning]:', ...args);
  },
  info: (...args: any[]) => {
    console.info('[EduEasy Info]:', ...args);
  },
  debug: (...args: any[]) => {
    console.log('[EduEasy Debug]:', ...args);
  }
};

export default logger;
