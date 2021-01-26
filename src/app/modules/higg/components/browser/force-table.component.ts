import { Component, OnInit, EventEmitter, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { BrowserOptions } from './../../objects/browser-options';
import { IExceptionError } from './../../interfaces/i-exception-error';
import { IBrowserAction } from '../../interfaces/i-browser-action';
import { ForceFormResponse } from '../form/force-form-response';
import { IBrowserObject } from '../../interfaces/i-browser-object';
import { Router } from '@angular/router';
import { ForceFormHelperService } from '../form/force-form-helper.service';
import { ApiService } from '../../services/api.service';
import { PageService } from './../../services/page.service';
import { Injector } from '@angular/core';
import {MBadgePipe} from '../../pipes/m-badge.pipe';
import {EscapeHtmlPipe} from '../../pipes/keep-html.pipe';

@Component({
  selector: 'force-table',
  templateUrl: './force-table.component.html',
  styles: []
})
export class ForceTableComponent implements OnInit, OnChanges {
  @Input() name: string; // table display name
  @Input() icon = 'icon-layers font-green';
  @Input() options: BrowserOptions; // = { page: 1, humanize: true, transform: 'table', where: {} };
  @Input() state: { action: string; data?: {} };

  @Output() action: EventEmitter<IBrowserAction> = new EventEmitter<IBrowserAction>();
  @Output() response: EventEmitter<ForceFormResponse> = new EventEmitter<ForceFormResponse>();
  @Output() data: EventEmitter<IBrowserObject> = new EventEmitter<IBrowserObject>();

  browser: IBrowserObject;
  table: string;
  errorMsg: string;

  // dynamicPipe: any;

  constructor(
    private _api: ApiService,
    private _page: PageService,
    private _router: Router,
    private _injector: Injector,
    private _form: ForceFormHelperService
  ) {}

  ngOnInit() {
    // this.dynamicPipe = MBadgePipe;
  }

  dynamicPipe(pipe) {
    if (pipe === 'mBadge') {
      return MBadgePipe;
    }
    else if (pipe === 'keppHtml') {
      return EscapeHtmlPipe;
    }
  }

  get hasError(): boolean {
    return !this.errorMsg ? false : true;
  }

  get hasTable() {
    return !this.table ? false : true;
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);

    if (changes.state && changes.state.currentValue) {
      const state = changes.state.currentValue;
      if (state.action === 'reload') {
        this.loadTable();
      }
      this.state = null;
    } else if (changes.options && changes.options.currentValue) {
      this.options = changes.options.currentValue;
      this.table = this.options.table || this.table;
      this.loadTable();
    }
  }

  loadTable() {
    if (this.options && this.options.table) {
      const eleId = `table-${this.table}`;
      this.table = this.options.table;
      // this.blockUI();
      this._api.req('/browser/' + this.table, this.options).subscribe(
        (tableData: IBrowserObject) => {
          this.browser = tableData;
          this.data.emit(tableData);
          // this.unblockUI();
          this.errorMsg = null;
        },
        (error: IExceptionError) => {
          // this.unblockUI();
          this.errorMsg = error.error;
          this._page.toastr(error.error, 'error');
        }
      );
      setTimeout( () => this.unblockUI(), 2000);
    }
  } // end

  updateBrowserWithFilters(options) {
    const newOptions = Object.assign(this.options, options);
    this.options = newOptions;
    console.log(this.options);
    this.loadTable();
  }

  triggerTool(tool) {
    this.action.emit(tool);
  }

  // handle row action redirect, routerLink, submitForm or emit action
  doAction(event, action, row) {
    const raise: IBrowserAction = {};
    action['row'] = row;
    Object.assign(raise, action);
    // console.log(raise);

    if (raise.redirect) {
      // redirect
      window.location.href = raise.redirect;
    } else if (raise.routerLink && raise.routerLink.indexOf('/') === 0) {
      // routerLink
      this.navigate(raise);
      //
    } else if (raise.form) {
      // silent form submission
      let confirmed = true;
      if (raise.confirm) {
        confirmed = confirm(raise.confirm);
      }
      if (confirmed) {
        this.submitForm(raise);
      }
    } else {
      // pass it along
      this.action.emit(raise);
    }
  }

  navigate(raise: IBrowserAction) {
    if (raise.routerLink && raise.routerLink.indexOf('/') === 0) {
      const nav = new Array();
      nav.push(raise.routerLink);
      if (raise.routeParams && raise.routeParams.length) {
        raise.routeParams.forEach(param => {
          nav.push(raise.row[param]);
        });
      }
      this._router.navigate(nav);
    }
  }

  submitForm(raise: IBrowserAction) {
    this._form
      .submitForm(raise.form, {
        action: raise.action,
        data: raise.row,
        query: { id: raise.row['id'] }
      })
      .subscribe((res: ForceFormResponse) => {
        const actionName = raise.label.toLowerCase();
        this._page.toastrAlert(res);
        if (actionName === 'delete' || actionName === 'trash') {
          this.loadTable();
        }
        this.response.emit(res);
      });
  }

  goToPage(page) {
    // console.log(page);
    this.options.page = page;
    this.loadTable();
  }

  get paginated() {
    return this.browser && this.browser.pageCount;
  }

  isCurrentPage(page) {
    return this.options && this.options.page && this.options.page == page;
  }

  get paginationSummary() {
    if (this.browser) {
      return (
        'Total found <span class="m-badge m-badge--primary">' +
        this.browser.pageCount +
        '</span>' +
        ' pages with ' +
        '<span class="m-badge m-badge--primary">' +
        this.browser.totalCount +
        '</span> ' +
        ' entries from <span class="m--font-transform-u"> ' +
        this.name +
        ' </span>'
      );
    }
    return '';
  }

  get browserSummary() {
    if (this.browser) {
      if (this.browser.page) {
        return (
          this.name +
          '<span class="m-badge m-badge--primary">' +
          this.browser.totalCount +
          '</span> ' +
          ' entries found in current criteria. <br>Currently viewing ' +
          '<span class="m-badge m-badge--primary">' +
          this.browser.count +
          '</span> of them.'
        );
      } else {
        return (
          (this.name || 'Table') +
          ' has <span class="m-badge m-badge--primary">' +
          this.browser.count +
          '</span> entries'
        );
      }
    }
    return '';
  }

  get hasFilters() {
    return this.browser && this.browser.filters;
  }

  blockUI() {
    // console.log('block ui');
    // this._page.blockUI('#table-' + this.table);
  }

  unblockUI() {
    // this._page.unblockUI('#table-' + this.table);
  }
} // end
