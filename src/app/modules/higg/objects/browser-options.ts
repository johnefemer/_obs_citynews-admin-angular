export class BrowserOptions {
    
  table: string;
  page: number;
  limit: number;
  where: {};
  order?: string;
  transform?: string;
  humanized?: boolean;
  columns?: boolean;

  constructor( options: { 
      table?: string;
      page?: number;
      limit?: number;
      where?: {};
      order?: string;
      transform?: string;
      humanized?: boolean;
      columns?: boolean;
  } = {} ){
      
      this.table = options.table;
      this.page = options.page || 0;
      this.limit = options.limit || 10;
      this.where = options.where || {};
      this.order = options.order || '';
      this.transform = options.transform || '';
      this.humanized = options.humanized || true;
      this.columns = options.columns || true;

  }

}