import { Component, OnInit } from '@angular/core';
import {Store, Select, Actions, ofActionDispatched} from '@ngxs/store';
import {Observable} from 'rxjs';
// import {ActionLoadTaxonomyTypes, AppStateModel} from '../../states/app.state';

import {ActivatedRoute, Router} from '@angular/router';

import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {TaxonomyEditorComponent, TaxonomyEditorParam} from './taxonomy-editor.component';

// import {TaxonomyMetaEditorDialogComponent} from './taxonomy-meta-editor-dialog.component';

import {TaxonomyModel} from '../_model/taxonomy.model';
import {ApiService} from '../../higg/services/api.service';
import {PageService} from '../../higg/services/page.service';
import {BrowserOptions} from '../../higg/objects/browser-options';
import {AppStateModel} from '../_states/app.state';
import {TaxonomyTypeModel} from '../_model/taxonomy-type.model';

@Component({
  selector: 'app-taxonomy-browser',
  templateUrl: './taxonomy-browser.component.html',
  styles: []
})
export class TaxonomyBrowserComponent implements OnInit {

  browserOptions: BrowserOptions;
  browserState: {};
  queryParams: {} = {};
  taxonomyType: string;

  taxonomyTypes: TaxonomyTypeModel[];
  taxonomySearchForm: FormGroup;
  taxonomyTypeObject: TaxonomyModel;

  @Select( state => state.app ) app$: Observable<AppStateModel>;
  @Select( state => state.app.taxonomyTypes ) taxonomyTypes$: Observable<TaxonomyTypeModel[]>;

  constructor(
    // private _store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private page: PageService,
    private dialog: MatDialog,
    private store: Store

  ) {

    this.route.queryParams.subscribe( where => {

      this.queryParams = {};

      if (where.taxonomy_type) {
        this.queryParams['taxonomy_type'] = where.taxonomy_type;
      }
      if (where.parent_id) {
        this.queryParams['parent_id'] = where.parent_id;
      }
      // this.queryParams['taxonomy_type'] = where['taxonomy_type'] || 'category';
      if (where.name) {
        // this.queryParams['name'] = where['name'];
        this.queryParams['crumbs'] = where.name;
      }
      // console.log(this.queryParams);
      this.browserOptions = new BrowserOptions( { where: this.queryParams, page: 1, order: 'name ASC', limit: 10, columns: true, table: 'taxonomy' } );
    });

  }

  ngOnInit() {

    this.initTaxonomySearchForm();
    // this._store.dispatch(new ActionLoadTaxonomyTypes());
    this.app$.subscribe( (appState: AppStateModel) => {
      this.taxonomyTypes = appState.taxonomyTypes;
    });

  }

  initTaxonomySearchForm() {
    this.taxonomySearchForm = new FormGroup({
      // term: new FormControl(),
      name: new FormControl(),
      taxonomy_type: new FormControl(this.route.snapshot.queryParams['taxonomy_type'] || '')
    });
    this.taxonomySearchForm.valueChanges.pipe(debounceTime(1000)).subscribe( values => {
      this.filterTaxonomies(values);
    } );
  }

  filterTaxonomies(values: { taxonomy_type: string, name?: string }) {
    let url = `/content/taxonomies?taxonomy_type=${values.taxonomy_type}`;
    if (values.name) {
      url += `&name=${values.name}`;
    }
    this.router.navigateByUrl( url ).then();
  }

  reloadBrowser() {
    this.browserState = { action: 'reload' };
  }

  toCategories() {
    this.router.navigateByUrl( '/content/taxonomies?taxonomy_type=category' ).then();
  }


  getTaxonomyType() : string {
    return this.taxonomySearchForm.controls['taxonomy_type'].value;
  }

  onAction(action) {
    if (action.action === 'new_child' || action.action === 'new') {

      const type = this.getTaxonomyType();
      if (type && action.action === 'new') {
        this.showTaxonomyEditor({ taxonomy_type: type });
      } else {
        this.showTaxonomyEditor({ parent_id: action.row['id'], taxonomy_type: action.row['taxonomyType'] });
      }

    } else if ( action.action === 'edit' ) {

      this.showTaxonomyEditor({ taxonomy_type: action.row['taxonomyType'], taxonomy_id: action.row['id'] });

    } else if ( action.action === 'rebuild_crumbs' ) {

      this.api.req('/action/taxonomy.rebuild_crumbs').subscribe( result => {
        this.page.toastrAlert(result);
        this.reloadBrowser();
      });

    } else if ( action.action === 'tagged_assets' ) {

      const ref = `taxonomy:${action.row['id']}`;
      console.log(ref);
      this.router.navigateByUrl(`/admin/asset-files;ref_tag=${ref}`).then();

    } else if ( action.action === 'assets' ) {

      this.router.navigateByUrl(`/admin/taxonomies/assets/${action.row['id']}`).then();

    } else if ( action.action === 'subcategories' ) {
      // /admin/taxonomies/list?taxonomy_type=category
      const type = this.getTaxonomyType();
      this.router.navigateByUrl( `/admin/taxonomies/list?taxonomy_type=${type}&parent_id=${action.row['id']}` ).then();

    }

  }

  createNewTaxonomy() {
    const taxonomy_type = this.getTaxonomyType();
    if (taxonomy_type) {
      // this.router.navigateByUrl(`/admin/taxonomies/editor/${type}/new`).then();
      this.showTaxonomyEditor({ taxonomy_type });
    } else {
      this.page.snackBar('Pick a Type.');
    }
  }

  showTaxonomyEditor(data: TaxonomyEditorParam) {

    this.taxonomyTypes.forEach( (t: TaxonomyTypeModel) => {

      if (t.slug === data.taxonomy_type) {
        data.form = t.params.taxonomy_form || 'taxonomy.register-form';
        if (t.params.has_meta) {
          data.form = `taxonomy_${t.slug}.register-form`;
        }
        this.dialog.open(TaxonomyEditorComponent, { width: '70%', height: '100%', data })
            .afterClosed()
            .subscribe( result => {
              this.browserState = { action: 'reload' };
            } );
        return;
      } // trigger form for specific taxo type

    } );




  }


}
