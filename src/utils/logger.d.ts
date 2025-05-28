declare module './logger' {
  const logger: {
    info: (message: string, ...args: any[]) => void;
    success: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
  };
  export default logger;
}
