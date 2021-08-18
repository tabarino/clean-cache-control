import { Purchase } from '@/domain/models';

export interface ILoadPurchases {
  loadAll: () => Promise<Array<LoadPurchases.Result>>;
}

export namespace LoadPurchases {
  export type Result = Purchase;
}
