import { Subject } from 'rxjs';
import { element } from 'protractor';
import {Injectable, Output, EventEmitter, HostListener} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {ApiService} from './api.service';
import {Store} from '@ngxs/store';
import {Location} from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// declare let mApp: any;
declare let toastr: any;
declare let window: any;
@Injectable()
export class PageService  {

  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  private contentHeaderSubject: Subject<any> = new Subject<any>();
  public contentHeader = this.contentHeaderSubject.asObservable();

  private toaster = false;

  idleTimeout = 5000;
  idleStart: string;

  constructor(
    private _router: Router,
    private _location: Location,
    private _snackBar: MatSnackBar,
    private _store: Store) { }

  store() {
    return this._store;
  }

  isMobileView() {
    return window.innerWidth < 800;
  }

  dialogOptions(data = null, style = { width: '80%', height: '100%', maxWidth: '100vw' }) {
    const options = {
      width: this.isMobileView() ? '100%' : style.width,
      height: this.isMobileView() ? '100%' : style.height,
      maxWidth: style.maxWidth,
      data
    };
    return options;
  }

  setContentHeader(header: { title: string }) {
    this.contentHeaderSubject.next(header);
  }

  blockUI(eleId: string, options = {}) {
    return;
    //
    // eleId = eleId || '.m-content';
    // const defaultOptions = {
    //   overlayColor: '#000000',
    //   type: 'loader',
    //   state: 'success',
    //   message: 'Please wait...'
    // };
    // options = Object.assign(defaultOptions, options);
    // // if (eleId.indexOf('#') !== 0 && eleId.indexOf('.') === 0) eleId = '#' + eleId;
    // mApp.block(eleId, options);
    // setTimeout(() => {
    //   mApp.unblock(eleId);
    // }, 5000);
  }

  unblockUI(eleId) {
    // eleId = eleId || '.m-content';
    // mApp.unblock(eleId);
  }

  toastr(message, type) {
    if (!this.toaster) {
      this.initToastr();
    }
    // toastr.success("New order has been placed!");
    toastr[type](message);
  }

  toastrAlert(response) {
    if (response['error']) {
      this.toastr(response['error'], 'error');
    }
    if (response['success']) {
      this.toastr(response['success'], 'success');
    }
  }

  private initToastr() {
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    };
  }

  initIdleTimer() {
    // console.log(window);
    // const $ = window['jquery'];
    const moment = window['moment'];
    window['jQuery'](document).on('idle.idleTimer', (event, elem, obj) => {
      if (this.idleStart) {
        const diff = moment(this.idleStart).diff() * -1;
        if (diff > this.idleTimeout) {
          this._router.navigateByUrl('/logout');
        }
      } else {
        this.idleStart = moment().format();
      }
    });
    window['jQuery'](document).on('active.idleTimer', (event, elem, obj, e) => {
      this.idleStart = null;
    });
  }

  modal(eleId, delay = 500) {
    setTimeout(() => {
      window['jQuery'](eleId).modal();
    }, delay);
  }

  closeModal() {
    window['jQuery']('button.closeModal').trigger('click');
  }

  goBack() {
    if (window.history.length > 2) {
      this._location.back();
    }
  }

  snackBar(response: any, options = { duration: 3000 }) {
    if (typeof response === 'string') {
      this._snackBar.open(response, 'Info', options);
    } else {
      if (response['error']) {
        this._snackBar.open(response['error'], 'Error', options);
      } else {
        this._snackBar.open(response['success'], 'Success', options);
      }
    }
  }

}
