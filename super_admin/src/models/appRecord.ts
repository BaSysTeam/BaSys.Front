export class AppRecord {
    id: string;
    title: string = '';
    memo: string = '';
  
    constructor(options: { [key: string]: any }) {
      this.id = options.id;
      this.title = options.title || '';
      this.memo = options.memo || '';
    }
  
    equals(obj: any): boolean {
      return obj instanceof AppRecord && this.id === obj.id;
    }
    
    toString(): string {
      return `${this.id}/${this.title}`;
    }
  }
  