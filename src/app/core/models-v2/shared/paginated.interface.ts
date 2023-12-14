export interface IPaginated<T> {
  total: number;
  found: number;
  limit: number;
  page: number;
  firstPage: number;
  lastPage: number;
  data: T[];
}
