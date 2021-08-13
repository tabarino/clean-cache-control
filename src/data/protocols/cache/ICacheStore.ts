export interface ICacheStore {
  delete: (key: string) => void;
  insert: (key: string) => void;
}
