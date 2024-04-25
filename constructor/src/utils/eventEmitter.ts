import { TinyEmitter } from 'tiny-emitter/index';

export default class EventEmitter {
  private static readonly EMITTER: TinyEmitter = new TinyEmitter();

  static on(event:string, callback:(args:any[]) => void, ctx?:any): void {
    this.EMITTER.on(event, callback, ctx);
  }

  static once(event:string, callback:(args:any[]) => void, ctx?:any): void {
    this.EMITTER.once(event, callback, ctx);
  }

  static emit(event:string, ...args:any[]): void {
    this.EMITTER.emit(event, args);
  }

  static off(event:string, callback?:(arg:any) => void | undefined): void {
    this.EMITTER.off(event, callback);
  }
}
