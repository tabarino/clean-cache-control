import { ICacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/useCases';

export class CacheStoreSpy implements ICacheStore {
  messages: Array<CacheStoreSpy.Message> = [];
  deleteKey!: string;
  insertKey!: string;
  insertValues: Array<SavePurchases.Params> = [];

  insert(key: string, value: any): void {
    this.messages.push(CacheStoreSpy.Message.insert);
    this.insertKey = key;
    this.insertValues = value;
  }

  delete(key: string): void {
    this.messages.push(CacheStoreSpy.Message.delete);
    this.deleteKey = key;
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.insert);
      throw new Error();
    });
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.delete);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert
  }
}
