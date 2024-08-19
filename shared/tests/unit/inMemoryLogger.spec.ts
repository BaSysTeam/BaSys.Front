import InMemoryLogger from '@/models/inMemoryLogger';
import { LogLevels } from '@/enums/logLevels';

describe('InMemoryLogger', () => {
  it('LogLevel:error, add message Debug. No messages.', () => {
    const logger = new InMemoryLogger(LogLevels.Error);
    logger.logDebug('test message');

    expect(logger.messages.length).toBe(0);
  });

  it('LogLevel:error, add message error. One message.', () => {
    const logger = new InMemoryLogger(LogLevels.Error);
    logger.logError('test message');

    expect(logger.messages.length).toBe(1);
  });

  it('LogLevel:error, add message critical. One message.', () => {
    const logger = new InMemoryLogger(LogLevels.Error);
    logger.logCritical('test message');

    expect(logger.messages.length).toBe(1);
  });
});
