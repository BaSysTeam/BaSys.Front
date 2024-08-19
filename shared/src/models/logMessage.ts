import { LogLevels } from '../enums/logLevels';

export default class LogMessage {
  period: Date;
  text: string;
  level: LogLevels;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.period = data.period || new Date();
    this.text = data.text || '';
    this.level = data.level || LogLevels.Trace;
  }

  toString(): string {
    return `${this.period}.${this.level}. ${this.text}`;
  }
}
