import { ApiService } from './../../services/api.service';
import { Component, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { EditorFormControl } from './editor-form-control';

import { FileUploader, Headers } from 'ng2-file-upload';
import { UploadedFile } from '../../objects/uploaded-file.object';
import { PageService } from '../../services/page.service';

@Component({
  moduleId: module.id,
  selector: 'fileinput-editor',
  templateUrl: 'input-fileinput-editor.component.html'
})
export class FileInputEditorComponent implements OnInit {
  @Input() control: EditorFormControl<any>;
  @Input() form: FormGroup;
  @Input() layout: string;

  uploader: FileUploader;
  fileItem: UploadedFile;

  help: string;
  editor: AbstractControl;

  constructor(private _page: PageService, private _api: ApiService) {}

  get isPristine() {
    return this.form.controls[this.control.key].pristine;
  }
  get isValid() {
    return this.form.controls[this.control.key].valid;
  }
  get isSuccessState() {
    return this.isPristine ? false : this.isValid;
  }
  get isErrorState() {
    return this.isPristine ? false : !this.isValid;
  }
  get isHorizontalLayout() {
    return this.layout && this.layout === 'horizontal';
  }

  thumbUrl() {
    if (this.fileItem && this.fileItem.type === 'image' && this.fileItem.thumbUrl) {
      return this.fileItem.thumbUrl;
    }
    return this.control.params['thumbUrl'];
  }

  getPic() {
    const url = this.thumbUrl();
    if (!url) {
      return 'none';
    }
    return `url('${url}')`;
  }

  deletePic() {
    this.detachValue();
  }

  detachValue() {
    this.control.value = null;
    this.control.params.filetype = null;
    this.form.controls[this.control.key].patchValue(null);
  }

  fileItemUrl() {
    if (this.fileItem && this.fileItem.url) {
      return this.fileItem.url;
    } else {
      return this.control.value ? this.control.value : 'None uploaded yet.';
    }
  }

  ngOnInit() {
    this.help = this.control.help;

    console.log(this.layout);

    this.editor = this.form['controls'][this.control.key];
    const valueChanges$ = this.form.controls[this.control.key].valueChanges;
    valueChanges$.subscribe(e => {
      if (this.isValid) {
        this.help = this.control.params.help;
      } else {
        this.help = this.control.label + ' is required to be valid';
      }
    });

    this.initUplaoder();
  }

  initUplaoder() {
    const publicFile = this.control.params['public'] ? '?public=1' : '';
    const baseUrl = this._api.baseUrl;

    const authHeader: Array<Headers> = [];
    const token = this._api.getAuthToken();
    authHeader.push({ name: 'Authorization', value: 'Bearer ' + token });

    this.uploader = new FileUploader({
      url: baseUrl + '/api/action/tools.uploader' + publicFile,
      // authTokenHeader: 'X-CSRF-TOKEN',
      // authToken: this.control.params.csrf,
      autoUpload: true,
      // headers: authHeader
    });

    this.uploader.onAfterAddingFile = (item => {
      item.withCredentials = false;
    });

    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      this.blockUI();
    };

    this.uploader.onSuccessItem = (item: any, response: string) => {
      this.afterUplaod(response);
      this.unblockUI();
    };
  }

  afterUplaod(resposne) {
    this.fileItem = new UploadedFile(JSON.parse(resposne));
    // console.log(this.fileItem);
    if (this.fileItem.size > 0) {
      this.control.value = this.fileItem.url;
      this.control.params.filetype = this.fileItem.type;
      this.form.controls[this.control.key].patchValue(this.control.value);
    }
  }

  blockUI() {
    this._page.blockUI('#' + this.control.name);
  }
  unblockUI() {
    this._page.unblockUI('#' + this.control.name);
  }
}
