import { LivestampDirective } from './../../directives/livestamp';
import { ForceAlertObject } from './../../objects/force-alert.object';
import { Component, Input } from '@angular/core';
// import { AlertObject, LivestampDirective } from '../../exports';

@Component({
    moduleId: module.id,
    selector: 'force-inline-alert',
    template: `
    <div *ngIf="alert" [class]="alertClass" role="alert">
      <div class="m-alert__icon">
        <i class="flaticon-exclamation-1"></i>
        <span></span>
      </div>
      <div class="m-alert__text">
        {{ alert.message }} &nbsp;&nbsp;
        <small class="text-muted" appLivestamp></small>
      </div>
      <div class="m-alert__close">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
    `
})
export class ForceInlineAlertComponent {

    @Input() alert: ForceAlertObject;

    constructor() {}

    get alertClass() {
        let alertType = `alert-${this.alert.type}`;
        switch (this.alert.type) {
          case 'error': alertType = 'alert-danger'; break;
          case 'success': alertType = 'alert-brand'; break;
        }
        return `m-alert m-alert--icon m-alert--icon-solid m-alert--outline alert ${alertType} alert-dismissible fade show`;
    }

}
