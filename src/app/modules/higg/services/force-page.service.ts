import { EditorFormControl } from './../components/form/editor-form-control';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { ForceAlertObject } from '../objects/force-alert.object';

import * as $ from 'jquery';

declare let window: any;
declare let mApp: any;
@Injectable()
export class ForcePageService {

  constructor() {
    setTimeout(() => {
        this.initToastr();
    }, 2000);
  }

brandColors: {
    blue?: string,
    red?: string,
    green?: string,
    purple?: string,
    grey?: string,
    yellow?: string
} = {
    'blue': '#89C4F4',
    'red': '#F3565D',
    'green': '#1bbc9b',
    'purple': '#9b59b6',
    'grey': '#95a5a6',
    'yellow': '#F8CB00'
};

getBrandColor(name) {
    return this.brandColors[name];
}

counterUp() {
    if (!window['jQuery']().counterUp) {
        return;
    }
    window['jQuery']('[data-counter=\'counterup\']').counterUp({delay: 10, time: 1000});
}

/*

    blockUI(target?: string, options: {
        overlayColor?: string,
        animate?: boolean,
        boxed?: boolean,
        message?: string
    } = {}) {
        target = target || '.blockui';
        window['App'].blockUI({
            target: target,
            // overlayColor: options.overlayColor || '#ffeb3b',
            animate: options.animate || true,
            boxed: options.boxed || false,
            message: options.message || null
        });
    }

    unblockUI(target?: string) {
        target = target || '.blockui';
        window['App'].unblockUI(target);
    }

    */

    blockUI(eleId: string, options = {}) {
        const defaultOptions = {overlayColor: '#000000', type: 'loader', state: 'success', message: 'Please wait...'};
        options = Object.assign(defaultOptions, options);
        //window['mApp'].block(eleId, options);
    }

    unblockUI(target) {
        //window['mApp'].unblock(target);
    }

modal(modalEleId, action = 'show') {
    window['jQuery']('#' + modalEleId).modal(action);
}


showSidebar() {
    if (window['jQuery']('.page-sidebar-menu-closed').length) {
        window['jQuery']('.sidebar-toggler').click();
    }
}

hideSidebar() {
    if (!window['jQuery']('.page-sidebar-menu-closed').length) {
        window['jQuery']('.sidebar-toggler').click();
    }
}

toastr(message: string, type: string = 'info', options: {} = null) {
    if (options) {
        this.initToastr(options);
    }
    window['toastr'][type](message);
}

toastrAlert(response) {
    if (response['success']) {
        this.toastr(response['success'], 'success');
    }
    if (response['error']) {
        this.toastr(response['error'], 'error');
    }
}

// FIX THIS
alert(options: {
    message?: string,
    type?: string,
    container?: string,
    placement?: string,
    timeout?: number,
    close?: boolean,
    focus?: boolean,
    reset?: boolean,
    icon?: string,
    subject?: string,
    medium?: string
} = {}) {
    const alert = new ForceAlertObject(options);
    // options = alert.alertOptions();
    window['App'].alert(alert);
}

initToastr(options: {} = {}) {
    const defaults = {
        'closeButton': true,
        'debug': false,
        'positionClass': 'toast-bottom-right',
        'showDuration': '1000',
        'hideDuration': '1000',
        'timeOut': '3000',
        'extendedTimeOut': '1000',
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut'
    };
    const merged = Object.assign(defaults, options);
    // console.log(window['toastr']);
    window['toastr'].options = merged;
} // initToastr


}
