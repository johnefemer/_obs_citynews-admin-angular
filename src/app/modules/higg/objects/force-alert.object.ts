export class ForceAlertObject {

  message: string;
  type: string;
  container: string;
  place: string;
  closeInSeconds: number;
  close: boolean;
  focus: boolean;
  reset: boolean;
  icon: string;
  medium: string;

  constructor(options: {
      message?: string,
      type?: string,
      container?: string,
      place?: string,
      closeInSeconds?: number,
      close?: boolean,
      focus?: boolean,
      reset?: boolean,
      icon?: string,
      medium?: string
  } = {}) {

      this.message = options.message || '';
      this.type = options.type || '';
      this.container = options.container || '';
      this.place = options.place || '';
      this.closeInSeconds = options.closeInSeconds || 0;      // auto hide
      this.close = options.close || false;                     // show close button
      this.focus = options.focus || true;                     // catch user foucs
      this.reset = options.reset || true;                     // reset container
      this.icon = options.icon || '';
      this.medium = options.medium || '';

  }

}
