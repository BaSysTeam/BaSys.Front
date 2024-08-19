import LogMessage from './logMessage';
import { LogLevels } from '../enums/logLevels';

export default class InMemoryLogger {
 messages: LogMessage[];
 minimumLevel: LogLevels;

 constructor(minimumLevel: LogLevels) {
   this.messages = [];
   this.minimumLevel = minimumLevel;
 }

 isEnabled(level: LogLevels): boolean {
   return level >= this.minimumLevel;
 }

 clear(): void {
   this.messages = [];
 }

 log(level: LogLevels, text: string): void {
   if (!this.isEnabled(level)) {
     return;
   }

   this.messages.push(new LogMessage({ level, text }));
 }

 logTrace(text: string): void {
   this.log(LogLevels.Trace, text);
 }

 logDebug(text: string): void {
   this.log(LogLevels.Debug, text);
 }

 logInfo(text: string): void {
   this.log(LogLevels.Information, text);
 }

 logWarning(text: string): void {
   this.log(LogLevels.Warning, text);
 }

 logError(text: string): void {
   this.log(LogLevels.Error, text);
 }

 logCritical(text: string): void {
   this.log(LogLevels.Critical, text);
 }
}
