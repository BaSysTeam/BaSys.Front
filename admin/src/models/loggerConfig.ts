import { LoggerKinds } from '@/enums/loggerKinds';
import { EventTypeLevelKinds } from '@/enums/eventTypeLevelKinds';
import { AutoClearIntervalKinds } from '@/enums/autoClearIntervalKinds';

export default class LoggerConfig {
  isEnabled!: boolean;
  loggerType!: LoggerKinds;
  autoClearInterval: AutoClearIntervalKinds = AutoClearIntervalKinds.Month;
  minimumLogLevel!: EventTypeLevelKinds;
  connectionString!: string;
  dbUid!: string;
  tableName?: string;
}
