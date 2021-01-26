import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HiggModule} from '../higg/higg.module';
import {TaxonomyTypesComponent} from './taxonomy/taxonomy-types.component';
import {ContentRoutingModule} from './content-routing.module';
import { ContentComponent } from './content.component';
import {TaxonomyBrowserComponent} from './taxonomy/taxonomy-browser.component';
import {TaxonomyEditorComponent} from './taxonomy/taxonomy-editor.component';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxsModule} from '@ngxs/store';
import {AppState} from './_states/app.state';
import {ReactiveFormsModule} from '@angular/forms';
import {ContentTypesComponent} from './content-type/content-types.component';
import { AuthoringContainerComponent } from './authoring/authoring-container.component';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { ContentEditorGenericComponent } from './authoring/content-editor-generic.component';



@NgModule({
  declarations: [
      ContentComponent,

      TaxonomyBrowserComponent,
      TaxonomyEditorComponent,
      TaxonomyTypesComponent,
      ContentTypesComponent,
      AuthoringContainerComponent,
      ContentEditorGenericComponent

  ],
    imports: [
        CommonModule,
        HiggModule,
        ReactiveFormsModule,
        MatDialogModule,
        ContentRoutingModule,
        MatButtonModule,
        MatMenuModule
    ]
})
export class ContentModule { }
