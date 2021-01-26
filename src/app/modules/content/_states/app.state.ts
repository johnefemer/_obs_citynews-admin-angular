import {State, StateContext, Action, Selector, Store, Select} from '@ngxs/store';
import {ApiService} from '../../higg/services/api.service';
import {tap} from 'rxjs/operators';
import {PageService} from '../../higg/services/page.service';
import {environment} from '../../../../environments/environment';
import {TaxonomyTypeModel} from '../_model/taxonomy-type.model';
import {TaxonomyModel} from '../_model/taxonomy.model';
import {Injectable} from '@angular/core';
import {ContentTypeModel} from '../_model/content-type.model';

export class ActionInitData {
  static readonly type = '[App] Init Data';
}

export class ActionResponseAlert {
  static readonly type = '[App] Show Response Alert';
  constructor( public payload: {}) {}
}

export class ActionLoadTaxonomyTypes {
  static readonly type = '[App] Load Taxonomy Types';
}

export class ActionLoadContentTypes {
  static readonly type = '[App] Load Content Types';
}



export interface AppStateModel {

  contentTypes: ContentTypeModel[];
  taxonomyTypes: TaxonomyTypeModel[];
  taxonomies: TaxonomyModel[];

}
//
// END APP STATE MODEL
//



@State<AppStateModel>({
  name: 'app',
  defaults: {

    contentTypes: null,
    taxonomyTypes: null,
    taxonomies: null,

  }
})
@Injectable()
export class AppState {

  //
  // @Selector() static getProductTypes(state: AppStateModel) {
  //   return state.productTypes;
  // }
  //
  // @Selector() static getBrands(state: AppStateModel) {
  //   return state.taxonomies.filter( item => item.taxonomy_type === 'brand' );
  // }

  constructor(private api: ApiService, private page: PageService, private store: Store) { }

  @Action(ActionResponseAlert)
  actionResponseAlert(ctx: StateContext<AppStateModel>, { payload }: ActionResponseAlert ) {
    this.page.toastrAlert(payload);
  }

  @Action(ActionInitData)
  actionInitData(ctx: StateContext<AppStateModel>) {
    ctx.dispatch([
      //
      new ActionLoadTaxonomyTypes(),
      // new ActionLoadTaxonomies(),
      new ActionLoadContentTypes(),

    ]);
  }


  @Action(ActionLoadTaxonomyTypes)
  actionLoadTaxonomyTypes( { patchState }: StateContext<AppStateModel> ) {
    return this.api.req('/action/content.taxonomy_types').pipe(
      tap( result => {
        patchState({ taxonomyTypes: result.data });
      })
    );
  }

  @Action(ActionLoadContentTypes)
  actionLoadContentTypes( { patchState }: StateContext<AppStateModel> ) {
    return this.api.req('/action/content.content_types').pipe(
        tap( result => {
          patchState({ contentTypes: result.data });
        })
    );
  }

  //
  // @Action(ActionLoadCategories)
  // actionLoadCategories( ctx: StateContext<AppStateModel> ) {
  //   return this.api.req('/action/store.categories').pipe(
  //     tap(result => {
  //       ctx.patchState({ categories: result.data });
  //     })
  //   );
  // }
  //
  // @Action(ActionLoadTaxonomies)
  // actionLoadTaxonomies( ctx: StateContext<AppStateModel> ) {
  //   return this.api.req('/action/store.taxonomies').pipe(
  //     tap(result => {
  //       ctx.patchState({ taxonomies: result.data });
  //     })
  //   );
  // }
  //
  // @Action(ActionLoadContacts)
  // actionLoadContacts( ctx: StateContext<AppStateModel> ) {
  //   return this.api.req('/action/store.contacts').pipe(
  //     tap(result => {
  //       ctx.patchState({ contacts: result.data });
  //     })
  //   );
  // }


} // END

