import { chalk } from 'chalk';
// ESM version of logger

const logger = {
  info: (message, ...args) => console.warn(chalk.blue('[INFO]'), message, ...args),
  success: (message, ...args) => console.warn(chalk.green('[SUCCESS]'), message, ...args),
  warn: (message, ...args) => console.warn(chalk.yellow('[WARN]'), message, ...args),
  error: (message, ...args) => console.error(chalk.red('[ERROR]'), message, ...args),
  // Production-safe logging that only logs in development
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(chalk.cyan('[DEBUG]'), message, ...args);
    }
  },
};

export default logger;
