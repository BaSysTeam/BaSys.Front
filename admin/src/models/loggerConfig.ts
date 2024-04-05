import { LoggerKinds } from '@/enums/loggerKinds';
import { EventTypeLevelKinds } from '@/enums/eventTypeLevelKinds';

export default class LoggerConfig {
  loggerType!: LoggerKinds;
  minimumLogLevel!: EventTypeLevelKinds;
  connectionString!: string;
  dbUid!: string;
  tableName?: string;
}
