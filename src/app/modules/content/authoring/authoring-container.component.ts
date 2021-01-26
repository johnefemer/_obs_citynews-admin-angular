import { Component, OnInit } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {ContentTypeModel} from '../_model/content-type.model';

@Component({
  selector: 'app-authoring-container',
  templateUrl: './authoring-container.component.html',
  styles: [
  ]
})
export class AuthoringContainerComponent implements OnInit {

  @Select( state => state.app.contentTypes ) contentTypes$: Observable<ContentTypeModel[]>;

  activeContentType: ContentTypeModel;

  constructor(
      private store: Store
  ) { }

  ngOnInit(): void {
  }

  onCreateContent(contentType) {
    this.activeContentType = contentType;
  }

}
