import {
  Component,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChange,
  EventEmitter,
  AfterViewInit,
  AfterViewChecked,
  ElementRef, ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ForcePageService } from './../../services/force-page.service';
import { ForceAlertObject } from './../../objects/force-alert.object';
import { ForceFormManifest } from './force-form-manifest';
import { ForceFormResponse } from './force-form-response';
import { ForceFormOptions } from './force-form-options';
import { ForceFormRequest } from './force-form-request';
import { ForceFormHelperService } from './force-form-helper.service';
import { ForceAlertService } from '../../services/force-alert.service';
import { EditorFormControl } from './editor-form-control';
import { IExceptionError } from '../../interfaces/i-exception-error';

@Component({
  moduleId: module.id,
  selector: 'force-form',
  templateUrl: 'force-form-generator.component.html',
  providers: [ForceFormHelperService, ForceAlertService] //  StateHelper, PageHelper
})
export class ForceFormGeneratorComponent implements OnChanges, OnInit {
  @Input() path: string;
  @Input() title: string;
  @Input() layout = 'horizontal'; // 'horizontal'
  @Input() icon: 'flaticon-layers';
  @Input() query: {};
  @Input() data: {};
  @Input() request: ForceFormRequest = new ForceFormRequest();
  @Input() options: ForceFormOptions = new ForceFormOptions();
  @Input() modal: boolean;

  @Output() response: EventEmitter<ForceFormResponse> = new EventEmitter<ForceFormResponse>();
  @Output() action: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() form: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() fields: EventEmitter<Array<EditorFormControl<any>>> = new EventEmitter<Array<EditorFormControl<any>>>();

  manifest: ForceFormManifest;
  controls: EditorFormControl<any>[] = [];
  dynamicForm: FormGroup;
  payload: string;
  submitted = false;
  errorMsg: string;

  loading = false;
  forceFormAlert: ForceAlertObject;

  constructor(
    private container: ElementRef,
    private formsService: ForceFormHelperService,
    private alert: ForceAlertService,
    private page: ForcePageService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // console.log(this.layout);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log(changes);
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          // case 'path': case 'data':
          case 'request':
            const changedProp = changes[propName];
            const prev = JSON.stringify(changedProp.previousValue);
            const current = JSON.stringify(changedProp.currentValue);
            // if (changedProp.currentValue && (changedProp.currentValue !=
            // changedProp.previousValue)) { if (changedProp.currentValue && (prev !=
            // current)) {
            if (changedProp.currentValue) {
              this.loadForm();
            }
            break;
        } // end switch
      }
    } // end for
  }

  get isHorizontal() {
    return this.layout && this.layout.indexOf('horizontal') > -1; // === 'form-horizontal';
  }

  initForm(title: string, path: string, query: {}, data: {}) {
    this.title = title;
    this.path = path;
    this.query = query;
    this.data = data;
    this.loadForm();
  }

  loadForm() {
    this.forceFormAlert = null;

    this.blockUI();
    if (!this.loading && this.path) {
      this.loading = true;
      if (this.query) {
        this.request.query = this.query;
      }
      if (this.data) {
        this.request.data = this.data;
      }
      const observe = this.formsService.getForm(this.path, this.request);
      observe.subscribe(
        (manifest: ForceFormManifest) => {
          this.errorMsg = null;
          this.manifest = manifest;
          this.createFormGroup(this.manifest.controls);
          this.unblockUI();
        },
        (error: IExceptionError) => {
          this.errorMsg = error.error;
          this.page.toastr(error.error, 'error');
        }
      );
      setTimeout(() => {
        this.loading = false;
        this.unblockUI();
      }, 2000);
    }
  }

  createFormGroup(formControls: Array<any>) {
    this.controls = [];
    formControls.forEach(control => {
      const editorControl = new EditorFormControl(control);
      editorControl.handle = this.doAction.bind(this);
      this.controls.push(editorControl);
    });

    this.dynamicForm = this.formsService.toFromGroup(formControls);
    this.cd.detectChanges();
    // console.log(this.dynamicForm);
    this.form.emit(this.dynamicForm);
    this.fields.emit(this.controls);
  }

  getEditorControl(control) {
    return new EditorFormControl(control);
  }

  get isActive() {
    return !!this.dynamicForm;
  }

  get isValid() {
    return this.dynamicForm.valid;
  }

  get isSubmitted() {
    return this.submitted;
  }

  formPathSlug() {
    const text = this.path;
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  get formId() {
    /*
        if (this.path) {
          return this.formPathSlug();
        }
        return ''; // new Date().getTime();
      */
    if (this.path) {
      return this.formPathSlug();
    }
  }

  blockUI() {
    this.page.blockUI('#' + this.formId);
  }
  unblockUI() {
    this.page.unblockUI('#' + this.formId);
  }

  resetForm() {
    this.dynamicForm = null;
  }

  clickAction(action) {
    if (action['confirm']) {
      const warning = action['warning'] || 'Are you sure?';
      if (!confirm(warning)) {
        return false;
      }
    }

    switch (action.action) {
      case 'reset':
        this.loadForm();
        break;
      case 'delete':
      case 'submit':
        this.onSubmit(action.action);
        break;
      default:
        this.doAction(action);
    }

    return false;
  }

  doAction(action) {
    // console.log(action);
    this.action.emit(action);
  }

  onSubmit(action) {
    this.blockUI();

    action = action || 'submit';
    const data = this.dynamicForm.value;
    this.payload = JSON.stringify(data);

    const postData = {
      query: this.query || this.request.query,
      data: data,
      action: action
    };

    this.forceFormAlert = null;
    const observe = this.formsService.submitForm(this.path, postData);
    observe.subscribe(result => {
      this.submitted = true;

      const message = result.success ? result.success : result.error;
      const alertType = result.success ? 'success' : 'error';
      const icon = result.success ? 'check-square' : 'chain-broken';
      this.forceFormAlert = new ForceAlertObject({ message: message, type: alertType });

      const response = new ForceFormResponse();
      response['path'] = this.path;
      response['action'] = action;
      Object.assign(response, result);
      this.response.emit(response);

      if (action === 'delete' && result.success) {
        this.resetForm();
      } else {
        if (result.controls) {
          this.resetFormControls(result.controls);
        }
      }

      this.unblockUI();
    });
  }

  resetFormControls(controls) {
    this.createFormGroup(controls);
  }
}
