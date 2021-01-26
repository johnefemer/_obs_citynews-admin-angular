import { ForceAlertObject } from './../objects/force-alert.object';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { EditorFormControl } from '../components/form/editor-form-control';

@Injectable()
export class ForceAlertService {

  history: string[] = [];
  alert: ForceAlertObject;

  constructor() {
      this.alert = new ForceAlertObject({});
      setTimeout(() => {
        this.initToastr();
      }, 2000);

  }

  initToastr() {

      window['toastr'].options = {
        'closeButton': true,
        'debug': false,
        'positionClass': 'toast-bottom-right',
        'showDuration': '1000',
        'hideDuration': '1000',
        'timeOut': this.alert.closeInSeconds || '3000',
        'extendedTimeOut': '1000',
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut'
    };

  }

  toastr(options = {}) {
      options['medium'] = 'toastr';
      options['type'] = options['type'] || 'success';
      Object.assign(this.alert, options);
      this.show(options);
  }

  show(options = {}) {
      // console.log(this.alert);
      Object.assign(this.alert, options);
      // console.log(this.alert);
      if (options['message'] && options['message'].length) {

          switch (this.alert.medium) {

              case 'toastr':
                  if (this.alert.type === 'success') {
                       window['toastr']['success'](this.alert.message, 'Success');
                  } else {
                      window['toastr']['error'](this.alert.message, 'Error');
                  }
                  break;

              default: this.showInlineAlert(); break;
          }

          this.history.push(options['message']);
      }

  } // end show

  showInlineAlert() {

      let typeClass = this.alert.type || 'info';
      if (typeClass === 'error') {
        typeClass = 'danger';
      }

      const options = {
          message: this.alert.message,
          container: this.alert.container || '#alerts',
          place: this.alert.place || 'append',
          type: typeClass,
          close: true,
          reset: true,
          focus: false,
          closeInSeconds: 10000,
          icon: this.alert.icon || ''
      };
      window['App'].alert(options);

  }


}
