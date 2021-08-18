import { ICacheStore } from "@/data/protocols/cache";
import { ISavePurchases, SavePurchases } from "@/domain/useCases";

export class LocalPurchases implements ISavePurchases {
  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly timestamp: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace('purchases', {
      timestamp: this.timestamp,
      value: purchases
    });
  }
}
