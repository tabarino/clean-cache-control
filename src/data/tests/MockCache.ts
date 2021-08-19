import { ICacheStore } from '@/data/protocols/cache';
import { LoadPurchases, SavePurchases } from '@/domain/useCases';

export const getCacheExpireDate = (timestamp: Date) => {
  const maxCacheAge = new Date(timestamp);
  maxCacheAge.setDate(maxCacheAge.getDate() - 3);
  return maxCacheAge;
}

export class CacheStoreSpy implements ICacheStore {
  actions: Array<CacheStoreSpy.Action> = [];
  deleteKey!: string;
  insertKey!: string;
  fetchKey!: string;
  insertValues: Array<SavePurchases.Params> = [];
  fetchResult: any;

  fetch(key: string): any {
    this.actions.push(CacheStoreSpy.Action.fetch);
    this.fetchKey = key;
    return this.fetchResult;
  }

  insert(key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert);
    this.insertKey = key;
    this.insertValues = value;
  }

  delete(key: string): void {
    this.actions.push(CacheStoreSpy.Action.delete);
    this.deleteKey = key;
  }

  replace(key: string, value: any): void {
    this.delete(key);
    this.insert(key, value);
  }

  simulateFetchError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.fetch);
      throw new Error();
    });
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
    insert,
    fetch
  }
}
