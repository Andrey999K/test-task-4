export type PaginatedResponseType<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};