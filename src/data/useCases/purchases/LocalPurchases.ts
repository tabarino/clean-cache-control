import { ICacheStore } from "@/data/protocols/cache";
import { ILoadPurchases, ISavePurchases, SavePurchases, LoadPurchases } from "@/domain/useCases";

export class LocalPurchases implements ILoadPurchases, ISavePurchases {
  private readonly key = 'purchases';

  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly timestamp: Date
  ) {}

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key);
      return cache.value;
    } catch (error) {
      this.cacheStore.delete(this.key);
      return [];
    }
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.timestamp,
      value: purchases
    });
  }
}
