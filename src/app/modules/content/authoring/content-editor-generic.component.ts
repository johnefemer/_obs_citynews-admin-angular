import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ContentTypeModel} from '../_model/content-type.model';
import {Store} from '@ngxs/store';
import {ApiService} from '../../higg/services/api.service';
import {PageService} from '../../higg/services/page.service';
import {ForceFormRequest} from '../../higg/components/form/force-form-request';

@Component({
  selector: 'app-content-editor-generic',
  templateUrl: './content-editor-generic.component.html',
  styles: [
  ]
})
export class ContentEditorGenericComponent implements OnInit, OnChanges {

  @Input() contentType: ContentTypeModel;

  contentFormName: string;
  contentFormPath: string;
  contentFormReq: ForceFormRequest;

  constructor(
      private store: Store,
      private api: ApiService,
      private page: PageService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.contentType.currentValue);
    if (changes.contentType.currentValue) {
      this.initForm(changes.contentType.currentValue);
    }
  }

  initForm(contentType: ContentTypeModel) {
    this.contentFormName = contentType.name;
    this.contentFormPath = 'content.register-form';
    this.contentFormReq = new ForceFormRequest( { content_type: contentType.slug } );
  }

  onResponse(response) {
    console.log(response);
  }

  onAction(action) {
    console.log(action);
  }


}
