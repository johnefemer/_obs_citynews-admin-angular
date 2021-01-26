export interface IBrowserAction {
  icon?: string;
  label?: string;
  action?: string;
  routerLink?: string;
  redirect?: string;
  confirm?: string;
  form?: string;

  id?: string;
  routeParams?: Array<string>;
  params?: Array<string>;

  row?: {};
}
