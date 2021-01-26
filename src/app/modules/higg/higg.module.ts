import { ApiService } from './services/api.service';
import { PageService } from './services/page.service';
import { InputSwitchEditorComponent } from './components/form/input-switch-editor.component';
import { InputTextEditorComponent } from './components/form/input-text-editor.component';
import { ForceInlineAlertComponent } from './components/form/force-inline-alert.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForceFormGeneratorComponent } from './components/form/force-form-generator.component';
import { ForceTextEditorComponent } from './components/form/force-text-editor.component';
import { ForceFormHelperService } from './components/form/force-form-helper.service';
import { ForceAlertService } from './services/force-alert.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LivestampDirective } from './directives/livestamp';
import { ForcePageService } from './services/force-page.service';
import { InputDropdownEditorComponent } from './components/form/input-dropdown-editor.component';
import { FileInputEditorComponent } from './components/form/input-fileinput-editor.component';
import { InputDateRangeEditorComponent } from './components/form/input-date-range-editor.component';

import { FileUploadModule } from 'ng2-file-upload';
import { InputTagsEditorComponent } from './components/form/input-tags-editor.component';
import { ForceFileUploadComponent } from './components/helpers/force-file-upload.component';
import { ForceTableComponent } from './components/browser/force-table.component';
import { ForceFileManagerComponent } from './components/helpers/force-file-manager.component';
import { ForceSettingsEditorComponent } from './components/helpers/force-settings-editor.component';
import { InlineAlertComponent } from './components/ui-elements/inline-alert.component';
import { DaterangePickerComponent } from './components/ui-elements/daterange-picker.component';
import { BrowserPaginationComponent } from './components/ui-elements/browser-pagination.component';

import { PluckPipe } from './pipes/pluck.pipe';
import { HumanizeWithPipe } from './pipes/humanize-with.pipe';
import { MBadgePipe } from './pipes/m-badge.pipe';
import {InputLookupEditorComponent} from './components/form/input-lookup-editor.component';
import {EscapeHtmlPipe} from './pipes/keep-html.pipe';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FileUploadModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatIconModule
    ],
  providers: [
    ForceFormHelperService,
    ForcePageService,
    ForceAlertService,
    ApiService,
    PageService,
    { provide: 'MBadgePipe', useClass: MBadgePipe }
  ],
  declarations: [
    ForceFormGeneratorComponent,
    ForceTextEditorComponent,
    LivestampDirective,
    ForceInlineAlertComponent,
    InputTextEditorComponent,
    InputDropdownEditorComponent,
    FileInputEditorComponent,
    InputSwitchEditorComponent,
    InputDateRangeEditorComponent,
    InputTagsEditorComponent,
    ForceFileUploadComponent,
    ForceTableComponent,
    ForceFileManagerComponent,
    ForceSettingsEditorComponent,
    InlineAlertComponent,
    DaterangePickerComponent,
    BrowserPaginationComponent,
    InputLookupEditorComponent,
    PluckPipe,
    HumanizeWithPipe,
    MBadgePipe,
    EscapeHtmlPipe
  ],
  exports: [
    ForceFormGeneratorComponent,
    ForceFileUploadComponent,
    ForceTableComponent,
    ForceFileManagerComponent,
    ForceSettingsEditorComponent,
    InputLookupEditorComponent,
    PluckPipe,
    EscapeHtmlPipe,
    HumanizeWithPipe,
    InputTextEditorComponent
  ]
})
export class HiggModule {}
