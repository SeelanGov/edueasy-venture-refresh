// ESM version of logger
import chalk from 'chalk';

const logger = {
  info: (message, ...args) => console.log(chalk.blue('[INFO]'), message, ...args),
  success: (message, ...args) => console.log(chalk.green('[SUCCESS]'), message, ...args),
  warn: (message, ...args) => console.warn(chalk.yellow('[WARN]'), message, ...args),
  error: (message, ...args) => console.error(chalk.red('[ERROR]'), message, ...args),
  // Production-safe logging that only logs in development
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(chalk.cyan('[DEBUG]'), message, ...args);
    }
  }
};

export default logger;
