import { PageService } from './../../services/page.service';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { UploadedFile } from './../../objects/uploaded-file.object';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'force-file-upload',
  templateUrl: './force-file-upload.component.html',
  styles: []
})
export class ForceFileUploadComponent implements OnInit {
  @Input() mode = 'auto'; // dropzone, multiple or empty
  @Input() owner: string = "";
  @Input() secure: number = 0;

  @Output() file: EventEmitter<UploadedFile> = new EventEmitter<UploadedFile>();
  @Output() handler: EventEmitter<FileUploader> = new EventEmitter<FileUploader>();

  // @Output() response: EventEmitter<ForceFormResponse> = new
  // EventEmitter<ForceFormResponse>();

  uploaderOptions: FileUploaderOptions;
  uploader: FileUploader;
  fileItem: UploadedFile;
  uploadCount = 0;
  uploading: any;

  hasBaseDropZoneOver = false;

  constructor(private _page: PageService) {}

  ngOnInit() {
    this.initUplaoder();
  }

  _ngOnChanges(changes: SimpleChanges) {
    if (changes.owner) {
      this.owner = changes.owner.currentValue;
      this.uploaderOptions = this.getUploaderOptions();
      if (this.uploader) {
        this.uploader.setOptions(this.uploaderOptions);
      } else {
        this.uploader = new FileUploader(this.uploaderOptions);
      }
    }
  }

  get isAutoUpload() {
    return this.mode == 'auto';
  }

  get isMultipleUpload() {
    return this.mode == 'multiple';
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  csrfToken() {
    let token = window['jQuery']('meta[name="csrf-token"]').attr('content');
    return token;
  }

  getUploaderOptions() {
    //let owner = this.owner ? '?owner=' + this.owner : '';
    let query = `?owner=${this.owner}&public=${this.secure}`;

    return {
      url: environment.baseUrl + '/api/action/tools.uploader' + query,
      withCredentials: false,
      // authTokenHeader: 'X-CSRF-TOKEN',
      // authToken: this.csrfToken(),
      autoUpload: false
    };
  }

  initUplaoder() {
    this.uploaderOptions = this.getUploaderOptions();

    this.uploader = new FileUploader(this.uploaderOptions);

    this.uploader.onAfterAddingFile = (fileItem: any) => {
      // console.log(fileItem);
      // console.log(this.uploader.queue);
      fileItem.withCredentials = false;
      if (this.isAutoUpload) {
        this.uploadAll();
      }
    };

    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      this.uploading = fileItem;
      // console.log(fileItem);
    };

    this.uploader.onSuccessItem = (item: any, response: string) => {
      let file = JSON.parse(response);
      console.log(file);

      if (file.error) {
        this._page.toastr(file.error, 'error');
        return false;
      }
      this.fileItem = new UploadedFile(file);
      this.uploadCount += 1;
      this._page.toastr(this.fileItem.displayName + ' upload completed.', 'success');
      this.file.emit(this.fileItem);
    };

    this.handler.emit(this.uploader);
  }

  sizeInKB(bytes) {
    if (bytes && bytes > 0) {
      let size = bytes / 1024;
      return Math.round(size);
    }
    return 0;
  }

  clearQueue() {
    if (this.uploader.queue.length) {
      this.uploader.clearQueue();
    }
  }

  cancelAll() {
    if (this.uploader.isUploading) {
      this.uploader.cancelAll();
    }
  }

  uploadAll() {
    if (this.uploader.getNotUploadedItems().length) {
      this.uploader.uploadAll();
    }
  }

  fileUploadStatusClass(fileItem: any) {
    if (fileItem['isUploading']) {
      return 'm--font-danger';
    } else if (fileItem['isUploaded']) {
      return 'm--font-primary';
    } else {
      return '';
    }
  }

  fileUploadState(fileItem: any) {
    if (fileItem['isUploading']) {
      return 'fa fa-spinner fa-spin';
    } else if (fileItem['isUploaded']) {
      return 'fa fa-check-circle-o';
    } else {
      return 'fa fa-ellipsis-h';
    }
  }
} // end
