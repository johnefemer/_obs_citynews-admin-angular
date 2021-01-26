import { PageService } from './../../services/page.service';
import { ApiService } from './../../services/api.service';
import { IBrowserObject } from './../../interfaces/i-browser-object';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-force-file-manager',
  templateUrl: './force-file-manager.component.html',
  styles: []
})
export class ForceFileManagerComponent implements OnInit {
  @Input() owner: string;
  @Input() mode = 'auto';

  ownerObject: {};
  files: IBrowserObject;
  file: {};

  constructor(private _api: ApiService, private _page: PageService) {}

  ngOnInit() {
    this.getOwner();
  }

  getOwner() {
    this._api.action('company.get_object', { query: { object_map: this.owner } }).subscribe(results => {
      if (results['data']) {
        this.ownerObject = results['data'];
        this.getOwnerFiles();
      }
    });
  }

  getOwnerFiles() {
    let where = { owner: this.owner };
    this._api.action('company.files', { query: { where: where } }).subscribe((results: IBrowserObject) => {
      this.files = results;
    });
  }

  fileDetails(file) {
    this.file = file;
  }

  makePublic(file) {
    if (confirm('Make this file url available for everyone?')) {
      this._api.action('company.file_make_public', { query: { file_id: file['id'] } }).subscribe(results => {
        this._page.toastrAlert(results);
        this.getOwnerFiles();
      });
    }
  }

  deleteFile(file) {
    if (confirm('Do you really want to delete this file?')) {
      this._api.action('company.file_delete', { query: { file_id: file['id'] } }).subscribe(results => {
        this._page.toastrAlert(results);
        this.getOwnerFiles();
      });
    }
  }

  onCompleteUpload(file) {
    this.getOwnerFiles();
  }

  onUploaderInit(uploader) {
    //
  }
}
