class LocalSavePurchases {
  constructor(private readonly cacheStore: ICacheStore) {}
}

interface ICacheStore {
}

class CacheStoreSpy implements ICacheStore {
  deleteCallsCount = 0;
}

describe("LocalSavePurchases", () => {
  test("Should not delete cache on Init", () => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore); // sut - System Under Test
    expect(cacheStore.deleteCallsCount).toBe(0);
  });
});
