class LocalSavePurchases {
  constructor(private readonly cacheStore: ICacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete();
  }
}

interface ICacheStore {
  delete: () => void;
}

class CacheStoreSpy implements ICacheStore {
  deleteCallsCount = 0;
  delete(): void {
    this.deleteCallsCount++;
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
});

describe("LocalSavePurchases", () => {
  test("Should delete old cache on Save", async () => {
    const { sut, cacheStore } = makeSut();
    sut.save();
    expect(cacheStore.deleteCallsCount).toBe(1);
  });
});
