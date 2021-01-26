import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ForceFormResponse } from '../form/force-form-response';

@Component({
  selector: 'app-inline-alert',
  template: `
  <div *ngIf="message" class="m-alert m-alert--outline alert alert-{{type}} alert-dismissible" role="alert">
	  <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>
	  <span>{{message}}</span>
  </div>
  `,
  styles: []
})
export class InlineAlertComponent implements OnInit, OnChanges {
  @Input() message: string;
  @Input() type: string;
  @Input() response: ForceFormResponse;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.response && changes.response.currentValue) {
      const res = changes.response.currentValue;
      if (res.error) {
        this.message = res.error;
        this.type = 'danger';
      } else {
        this.message = res.success;
        this.type = 'success';
      }
    }
  }
}
