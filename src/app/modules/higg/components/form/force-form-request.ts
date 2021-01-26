export class ForceFormRequest {
  data?: {};
  query?: {};
  constructor(data?: {}, query?: {}) {
      this.data = data || {};
      this.query = query || {};
  }
}
