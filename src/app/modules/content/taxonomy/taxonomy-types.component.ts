import { Component, OnInit } from '@angular/core';

import {Actions, ofActionDispatched} from '@ngxs/store';
import {Router} from '@angular/router';
import {PageService} from '../../higg/services/page.service';
import {BrowserOptions} from '../../higg/objects/browser-options';
import {ForceFormRequest} from '../../higg/components/form/force-form-request';

@Component({
  selector: 'app-taxonomy-types',
  templateUrl: './taxonomy-types.component.html',
  styles: []
})
export class TaxonomyTypesComponent implements OnInit {

  formTitle: string;
  formPath: string;
  formReq: ForceFormRequest;

  browserState: {};
  browserOptions: BrowserOptions;
  activeTaxonomyType: {};

  constructor(
      private page: PageService,
      private router: Router,
      private actions$: Actions) {

    // this.actions$.pipe( ofActionDispatched(ActionLoadTaxonomyTypes) ).subscribe( () => {
    //   this.browserState = { action: 'reload' };
    // });
    //
  }

  ngOnInit() {
    this.initForm();
    this.initBrowser();
  }

  initForm() {
    this.formPath = 'taxonomy_type.register-form';
    this.formTitle = 'Taxonomy Type';
    this.formReq = new ForceFormRequest();
  }

  initBrowser() {
    this.browserOptions = new BrowserOptions({ table: 'taxonomy_type', where: {}, page: 1, limit: 10, columns: true });
  }

  onResponse(response) {
    this.page.toastrAlert(response);
    // this.page.store().dispatch(new ActionLoadTaxonomyTypes());
  }

  onAction(action) {

    switch (action.action) {

      case 'edit':
        this.activeTaxonomyType = action.row;
        this.formReq = new ForceFormRequest( {}, { id: this.activeTaxonomyType['id'] });
        break;

      case 'new':
        this.formReq = new ForceFormRequest( {}, {});
        break;

      case 'browse':
        this.router.navigateByUrl(`/content/taxonomies?taxonomy_type=${action.row.slug}`).then();
        break;

    }

  }

}
