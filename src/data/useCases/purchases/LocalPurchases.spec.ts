import { mockPurchases, CacheStoreSpy } from '@/data/tests';
import { LocalPurchases } from '@/data/useCases';

type SutTypes = {
  sut: LocalPurchases,
  cacheStore: CacheStoreSpy
};

// SUT - System Under Test
const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalPurchases(cacheStore, timestamp);
  return { sut, cacheStore };
};

describe("LocalPurchases", () => {
  test("Should not delete or insert cache on Init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });

  test("Should return empty list if load fails", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateFetchError();
    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test("Should return a list of purchases if cache is less than 3 days old", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);
    timestamp.setDate(timestamp.getDate() - 3);
    timestamp.setSeconds(timestamp.getSeconds() + 1);
    const { sut, cacheStore } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases
    }
    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(purchases).toEqual(cacheStore.fetchResult.value);
  });

  test("Should return an empty list if cache is empty", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);
    timestamp.setDate(timestamp.getDate() - 3);
    timestamp.setSeconds(timestamp.getSeconds() + 1);
    const { sut, cacheStore } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: []
    }
    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test("Should return an empty list if cache is greater than 3 days old", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);
    timestamp.setDate(timestamp.getDate() - 3);
    timestamp.setSeconds(timestamp.getSeconds() - 1);
    const { sut, cacheStore } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases
    }
    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test("Should return an empty list if cache is equal to 3 days old", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);
    timestamp.setDate(timestamp.getDate() - 3);
    const { sut, cacheStore } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases
    }
    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
    expect(cacheStore.fetchKey).toBe('purchases');
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test("Should not insert new cache if delete fails", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateDeleteError();
    const result = sut.save(mockPurchases());
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete
    ]);
    await expect(result).rejects.toThrow();
  });

  test("Should delete old cache and insert new cache if delete succeeds", async () => {
    const timestamp = new Date();
    const { sut, cacheStore } = makeSut(timestamp);
    const purchases = mockPurchases();
    const promise = sut.save(purchases);
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert
    ]);
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases
    });
    await expect(promise).resolves.toBeFalsy();
  });

  test("Should throw error if insert throws", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert
    ]);
    await expect(promise).rejects.toThrow();
  });
});
