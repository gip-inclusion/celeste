import settings from '../settings';

export default {
  level: settings.logger.level,
  transport:
    settings.environment === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
};
