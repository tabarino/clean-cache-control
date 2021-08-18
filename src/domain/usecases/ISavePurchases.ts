import { Purchase } from '@/domain/models';

export interface ISavePurchases {
  save: (purchases: Array<SavePurchases.Params>) => Promise<void>;
}

export namespace SavePurchases {
  export type Params = Purchase;
}
