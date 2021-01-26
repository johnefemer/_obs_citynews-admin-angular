import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TaxonomyTypesComponent} from './taxonomy/taxonomy-types.component';
import {ContentComponent} from './content.component';
import {TaxonomyBrowserComponent} from './taxonomy/taxonomy-browser.component';
import {ContentTypesComponent} from './content-type/content-types.component';
import {AuthoringContainerComponent} from './authoring/authoring-container.component';


const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [

      { path: 'authoring', component: AuthoringContainerComponent },
      { path: 'taxonomies', component: TaxonomyBrowserComponent },
      { path: 'taxonomy-types', component: TaxonomyTypesComponent },
      { path: 'content-types', component: ContentTypesComponent },

      //
      // {
      //   path: 'products',
      //   component: ProductsComponent,
      // },
      // {
      //   path: 'product/add',
      //   component: ProductEditComponent
      // },
      // {
      //   path: 'product/edit',
      //   component: ProductEditComponent
      // },
      // {
      //   path: 'product/edit/:id',
      //   component: ProductEditComponent
      // },
      //
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { path: '**', redirectTo: 'categories', pathMatch: 'full' },

    ],
  },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [ RouterModule ]
})
export class ContentRoutingModule { }
