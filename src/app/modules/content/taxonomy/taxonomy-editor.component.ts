import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {Select, Store} from '@ngxs/store';
// import {AppStateModel} from '../../states/app.state';
import {ForceFormRequest} from '../../higg/components/form/force-form-request';
import {TaxonomyTypeModel} from '../_model/taxonomy-type.model';
import {PageService} from '../../higg/services/page.service';

export interface TaxonomyEditorParam {
  taxonomy_id?: number;
  taxonomy_type: string;
  parent_id?: number;
  name?: string;
  form?: string;
}

@Component({
  selector: 'app-taxonomy-editor',
  templateUrl: './taxonomy-editor.component.html',
  styles: []
})
export class TaxonomyEditorComponent implements OnInit {

  formPath: string;
  formTitle: string;
  formReq: ForceFormRequest;

  taxonomyType: string;
  taxonomyId: number;

  taxonomyTypeObject: TaxonomyTypeModel;

  constructor(
    private page: PageService,
    private store: Store,
    private dialogRef: MatDialogRef<TaxonomyEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TaxonomyEditorParam
  ) {


  }

  ngOnInit() {
    //
    // this.store.select( state => {
    //   return state.app.taxonomyTypes;
    // } ).subscribe( (result: TaxonomyTypeModel[]) => {
    //   result.forEach( item => {
    //     if (item.slug === this.data.taxonomy_type) {
    //       this.taxonomyTypeObject = item;
    //       this.formTitle = this.taxonomyTypeObject.name;
    //     }
    //   } );
    // } );

    this.initForm();
  }

  initForm() {
    console.log(this.data);
    this.formPath = this.data.form;
    this.formTitle = this.data.name || 'Taxonomy';
    if (!this.data.taxonomy_id) {
      this.formReq = new ForceFormRequest({ parent_id: this.data.parent_id || 0, taxonomy_type: this.data.taxonomy_type });
    } else {
      this.formReq = new ForceFormRequest({ taxonomy_type: this.data.taxonomy_type }, { id: this.data.taxonomy_id });
    }
  }

  onResponse(response) {
    this.page.toastrAlert(response);
    if (!response.error) {
      this.dialogRef.close(response);
    }
  }



}
