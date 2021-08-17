import { ICacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/useCases';

export class CacheStoreSpy implements ICacheStore {
  actions: Array<CacheStoreSpy.Action> = [];
  deleteKey!: string;
  insertKey!: string;
  insertValues: Array<SavePurchases.Params> = [];

  insert(key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert);
    this.insertKey = key;
    this.insertValues = value;
  }

  delete(key: string): void {
    this.actions.push(CacheStoreSpy.Action.delete);
    this.deleteKey = key;
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.insert);
      throw new Error();
    });
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.delete);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Action {
    delete,
    insert
  }
}
