import { ICacheStore } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/useCases";

class CacheStoreSpy implements ICacheStore {
  insertCallsCount = 0;
  deleteCallsCount = 0;
  key!: string;

  delete(key: string): void {
    this.deleteCallsCount++;
    this.key = key;
  }
}

type SutTypes = {
  sut: LocalSavePurchases,
  cacheStore: CacheStoreSpy
}

// SUT - System Under Test
const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);
  return { sut, cacheStore };
}

describe("LocalSavePurchases", () => {
  test("Should not delete cache on Init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  test("Should delete old cache on Save", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.save();
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.key).toBe('purchases');
  });

  test("Should not insert new cache if delete fails", async () => {
    const { sut, cacheStore } = makeSut();
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });
    const result = sut.save();
    expect(cacheStore.insertCallsCount).toBe(0);
    expect(result).rejects.toThrow();
  });
});
