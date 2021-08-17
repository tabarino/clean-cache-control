import { mockPurchases, CacheStoreSpy } from '@/data/tests';
import { LocalSavePurchases } from '@/data/useCases';

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
  test("Should not delete or insert cache on Init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.messages).toEqual([]);
  });

  test("Should delete old cache on Save", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.save(mockPurchases());
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert
    ]);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  test("Should not insert new cache if delete fails", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateDeleteError();
    const result = sut.save(mockPurchases());
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete
    ]);
    await expect(result).rejects.toThrow();
  });

  test("Should insert new cache if delete succeeds", async () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert
    ]);
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  test("Should throw error if insert throws", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();
    const result = sut.save(mockPurchases());
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert
    ]);
    await expect(result).rejects.toThrow();
  });
});
