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
