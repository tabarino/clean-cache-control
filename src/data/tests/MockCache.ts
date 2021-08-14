import { ICacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/useCases';

export class CacheStoreSpy implements ICacheStore {
  insertCallsCount = 0;
  deleteCallsCount = 0;
  deleteKey!: string;
  insertKey!: string;
  insertValues: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.deleteCallsCount++;
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.insertCallsCount++;
    this.insertKey = key;
    this.insertValues = value;
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      throw new Error();
    });
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });
  }
}
