export class ForceFormOptions {
  container?: string;
  layout?: string;
  showTitle?: boolean;
  showActions?: boolean;
  colWidth?: string;

  constructor( options: {
      container?: string,
      layout?: string,
      showTitle?: boolean,
      showActions?: boolean,
      colWidth?: string
  } = {} ){
      this.container = options.container;
      this.layout = options.layout || 'horizontal';
      this.showActions = options.showActions || true;
      this.showTitle = options.showTitle || true;
      this.colWidth = options.colWidth || '12';
  }

}
