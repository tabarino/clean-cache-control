import { ICacheStore } from "@/data/protocols/cache";
import { ISavePurchases, SavePurchases } from "@/domain/useCases";

export class LocalPurchases implements ISavePurchases {
  private readonly key = 'purchases';

  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly timestamp: Date
  ) {}

  async loadAll(): Promise<void> {
    this.cacheStore.fetch(this.key);
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.timestamp,
      value: purchases
    });
  }
}
