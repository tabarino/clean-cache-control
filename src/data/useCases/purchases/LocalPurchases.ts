import { ICacheStore, CachePolicy } from "@/data/protocols/cache";
import { ILoadPurchases, ISavePurchases, SavePurchases, LoadPurchases } from "@/domain/useCases";

export class LocalPurchases implements ILoadPurchases, ISavePurchases {
  private readonly key = 'purchases';

  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly currentDate: Date
  ) {}

  validate(): void {
    try {
      const cache = this.cacheStore.fetch(this.key);
      
      if (!CachePolicy.validate(cache.timestamp, this.currentDate)) {
        throw new Error();
      }

    } catch (error) {
      this.cacheStore.delete(this.key);
    }
  }

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key);

      if (!CachePolicy.validate(cache.timestamp, this.currentDate)) {
        throw new Error();
      }

      return cache.value;

    } catch (error) {
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
