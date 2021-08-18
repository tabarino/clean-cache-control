import { ICacheStore } from "@/data/protocols/cache";
import { ILoadPurchases, ISavePurchases, SavePurchases, LoadPurchases } from "@/domain/useCases";

export class LocalPurchases implements ILoadPurchases, ISavePurchases {
  private readonly key = 'purchases';

  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly currentDate: Date
  ) {}

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key);
      const maxAge = new Date(cache.timestamp);
      maxAge.setDate(maxAge.getDate() + 3);

      if (maxAge <= this.currentDate) {
        throw new Error();
      }

      return cache.value;

    } catch (error) {
      this.cacheStore.delete(this.key);
      return [];
    }
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.currentDate,
      value: purchases
    });
  }
}
