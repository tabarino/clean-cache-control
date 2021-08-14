import { ICacheStore } from '@/data/protocols/cache';
import { mockPurchases } from '@/data/tests';
import { LocalSavePurchases } from '@/data/useCases';
import { SavePurchases } from '@/domain/useCases';

class CacheStoreSpy implements ICacheStore {
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

type SutTypes = {
  sut: LocalSavePurchases,
  cacheStore: CacheStoreSpy
};

// SUT - System Under Test
const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);
  return { sut, cacheStore };
};

describe("LocalSavePurchases", () => {
  test("Should not delete cache on Init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  test("Should delete old cache on Save", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.save(mockPurchases());
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  test("Should not insert new cache if delete fails", () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateDeleteError();
    const result = sut.save(mockPurchases());
    expect(cacheStore.insertCallsCount).toBe(0);
    expect(result).rejects.toThrow();
  });

  test("Should insert new cache if delete succeeds", async () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  test("Should throw error if insert throws", () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();
    const result = sut.save(mockPurchases());
    expect(result).rejects.toThrow();
  });
});
