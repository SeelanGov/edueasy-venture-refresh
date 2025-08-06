declare module './logger' {
  const logger: {,
  info: (message: string, ...args: unknow,
  n[]) => void;,
  success: (message: string, ...args: unknow,
  n[]) => void;,
  warn: (message: string, ...args: unknow,
  n[]) => void;,
  error: (message: string, ...args: unknow,
  n[]) => void;
  };
  export default logger;
}
