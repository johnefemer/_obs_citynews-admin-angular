export interface IBrowserObject {

  columns: any;
  data: any[];
  actions?: any;
  filters?: any;
  count?: number;
  limit?: number;
  nextPage?: number;
  page?: number;
  pageChunks?: number[];
  pageCount?: number;
  prevPage?: number;
  totalCount?: number;
  tools?: [{}];

  took?: number;
}
