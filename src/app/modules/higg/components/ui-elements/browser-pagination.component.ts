import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IBrowserObject } from '../../interfaces/i-browser-object';

@Component({
  selector: 'app-browser-pagination',
  template: `
  <div *ngIf="browser && browser.pageChunks" class="row">
    <div class="col-sm-12">
        <div class="btn-group m-btn-group">
            <a (click)="toPage(page)" *ngFor="let page of browser.pageChunks" [class.btn-brand]="!isActive(page)" [class.btn-metal]="isActive(page)" class="btn m-btn btn-sm pointer"> <span class="m-badge m-badge--metal">{{ page }}</span></a>
        </div>

        <p style="margin-top: 10px;">
          <small *ngIf="options.summary" [innerHtml]="paginationSummary" ></small>
        </p>

    </div>
  </div>
  `,
  styles: []
})
export class BrowserPaginationComponent implements OnInit {
  @Input() browser: IBrowserObject;
  @Input() options: { name?: string; summary?: boolean } = {};
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  @Output() page: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {
    // console.log(this.options);
  }

  isActive(page) {
    return this.browser.page === page;
  }

  toPage(page) {
    if (this.isActive(page)) {
      return;
    }
    // console.log(page);
    this.page.emit(page);
    const action = { action: 'page', label: 'page ' + page, data: { page: page }, page: page };
    this.action.emit(action);
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
        (this.options.name || '') +
        ' </span>'
      );
    }
    return '';
  }

  get browserSummary() {
    if (this.browser) {
      if (this.browser.page) {
        return (
          (this.options.name || '') +
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
          (this.options.name || 'Record') +
          ' has <span class="m-badge m-badge--primary">' +
          this.browser.count +
          '</span> entries'
        );
      }
    }
    return '';
  }

}
