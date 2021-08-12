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

describe("LocalSavePurchases", () => {
  test("Should not delete cache on Init", () => {
    const cacheStore = new CacheStoreSpy();
    new LocalSavePurchases(cacheStore);
    expect(cacheStore.deleteCallsCount).toBe(0);
  });
});

describe("LocalSavePurchases", () => {
  test("Should delete old cache on Save", async () => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore); // sut - System Under Test
    sut.save();
    expect(cacheStore.deleteCallsCount).toBe(1);
  });
});
