import { ICacheStore } from "@/data/protocols/cache";

export class LocalSavePurchases {
  constructor(private readonly cacheStore: ICacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete('purchases');
  }
}
