import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  AfterViewChecked,
  AfterViewInit
} from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { EditorFormControl } from './editor-form-control';
// import { NuforceApiService } from '../../../nuforce/services/nuforce-api.service';
// import { PageService } from './../../../theme/services/page.service';

// import { EditorFormControl } from '../form/control.object';
// import { SimpleChanges } from '@angular/core';
// import { ForceApiService } from '../force-api';
// import { PageHelper } from '../page-helper';


import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'input-text-editor',
  styles: [
    `
      input.datepicker {
        width: 100% !important;
        padding: 10px;
      }
    `
  ],
  template: `
<div *ngIf="!!control && !isHidden" class="form-group row"> <!-- [class]="control.formGroup" m-form__group  -->

    <label class="col-lg-3 col-form-label" [attr.for]="control.name" >{{ control.label }} <span *ngIf="control.validators && control.validators.required">*</span> </label>

    <div *ngIf="!control.hasActions" class="col-lg-9">
        <input type="{{ textType() }}" *ngIf="!isLargeText" id="{{ control.name }}" [class]="control.formControl" [formControl]="formControl" />
        <textarea [id]="control.name" *ngIf="!control.isReadonly && isLargeText" [placeholder]="control.placeholder" [formControl]="formControl" [ngClass]="{ 'edited': control.edited }" [class]="control.formControl"></textarea>
        <span class="m-form__help" [innerHtml]="control.help"></span>
        <!-- <div class="form-control-focus"> </div> -->
    </div>

    <div *ngIf="!isLargeText && control.hasActions" class="col-lg-9">
        <div class="input-group">
            <input type="{{ textType() }}" id="{{ control.name }}" placeholder="{{ control.placeholder }}" [class]="control.formControl" [formControl]="formControl"/>
            <!--
            <div class="input-group-control">
                <input type="text" id="{{ control.name }}" [class]="control.formControl" [formControl]="formControl" />
                <span class="help-block" [innerHtml]="control.help"></span>
                <div class="form-control-focus"> </div>
            </div>
            -->
            <span *ngIf="control.hasActions" class="input-group-btn btn-right">
                <button type="button" class="btn green-haze dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> <i class="icon-settings"></i>
                    <i class="fa fa-angle-down"></i>
                </button>
                <ul class="dropdown-menu pull-right" role="menu">
                    <li *ngFor="let action of control.actions" >
                        <a (click)="control.doAction(action)" >{{ action.label }}</a>
                    </li>
                </ul>
            </span>
        </div>
    </div>

</div>

<div *ngIf="locationPredictions.length > 0" class="row">
    <div class="col-lg-3"></div>
    <div class="col-lg-9">

        <div class="m-section">
          <div class="m-section__content">

            <table class="table table-sm m-table m-table--head-bg-brand">
            <tbody>
              <tr *ngFor="let loc of locationPredictions" (click)="chooseLocation(loc)" >
                <td>{{ loc.description }}</td>
                <td>
                  <a class="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air">
                    <i class="la la-map-marker"></i>
                  </a>
                </td>
              </tr>
              </tbody>
            </table>

          </div>
        </div>

    </div>
</div>

<div id="places-map" style="display: none;"></div>

<div *ngIf="!!control && isHidden" [formGroup]="form">
    <input type="hidden" [id]="control.name" [formControlName]="control.key" />
</div>


    `
})
export class InputTextEditorComponent implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Input() control: EditorFormControl<any>;

  locationPredictions = [];
  lookup = false;
  codeMirror: any;

  formControl: AbstractControl;

  constructor() {}

  ngOnInit() {
    this.formControl = this.form.controls[this.control.key];
  }

  ngAfterViewInit() {
    if (this.control.params.type === 'textarea') {
      // window['autosize'](document.querySelector('textarea'));
      this.initLargeTextEditor();
    } else {
      if (this.control.params.class) {
        if (this.control.params.class.indexOf('date') > -1) {
          this.initDatepicker();
        } else if (this.control.params.class.indexOf('time') > -1) {
          this.initTimepicker();
        } else if (this.control.params.class.indexOf('typeahead') > -1) {
          this.initTypeahead();
        } else if (
          this.control.params.class.indexOf('places-autocomplete') > -1
        ) {
          this.initGooglePlacesAutoComplete();
        } else if (this.control.params.class.indexOf('codemirror') > -1) {
          this.initCodeMirror();
        }
      }
    }
  } // ngAfterContentInit

  get isHidden() {
    return this.control.params.type === 'hidden';
  }

  get isLargeText() {
    return this.control.params.type === 'textarea';
  }

  get isCodeMirror() {
    return this.control.params.class.indexOf('codemirror') > -1;
  }

  textType(){
    return this.control.params.type ? this.control.params.type : 'text';
  }

  initCodeMirror() {
    const eleId = this.control.name;
    const myTextArea = document.getElementById(eleId);
    this.codeMirror = window['CodeMirror'].fromTextArea(myTextArea, {
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      theme: 'neat',
      mode: 'javascript'
    });
    this.codeMirror.on('blur', () => {
      const value = this.codeMirror['getValue']();
      this.formControl.patchValue(value);
    });
  }

  initLargeTextEditor() {
    const className = this.control.params.class || 'autosizeme';
    const eleId = this.control.name;
    if (!this.isLargeText || !className) {
      return;
    }
    if (className.indexOf('autosizeme') > -1) {
      window['autosize'](document.querySelector('#' + eleId));
    } else if (className.indexOf('markdown') > -1) {
      // console.log('markdown');
      // $("#some-textarea").markdown({autofocus:false,savable:false})
      window['jQuery']('#' + eleId).markdown({
        autofocus: false,
        savable: true,
        hiddenButtons: [
          // 'cmdImage', 'cmdUrl', 'cmdCode'
        ],
        onSave: e => {
          console.log(e.getContent());
          this.formControl.patchValue(e.getContent());
        }
      });
    } else if (className.indexOf('summernote') > -1) {
      // console.log('markdown');
      // $("#some-textarea").markdown({autofocus:false,savable:false})
      window['jQuery']('#' + eleId).summernote({
        height: 450,
        placeholder: 'start typing here...',
        disableDragAndDrop: true,
        airMode: false,
        callbacks: {
          onInit: () => {
            // console.log("Editor Init!");
            this.onInitSummernoteContent();
          },
          onBlur: () => {
            this.onEditSummernoteContent();
          }
        }
      });
    } else if (className.indexOf('codemirror') > -1) {
      this.initCodeMirror();
    }
  }

  onEditSummernoteContent() {
    const eleId = this.control.name;
    // var markupStr = $('#summernote').summernote('code');
    const content = window['jQuery']('#' + eleId).summernote('code');
    // console.log(content);
    this.formControl.patchValue(content);
    // console.log(this.formControl.value);
  }

  onInitSummernoteContent() {
    const eleId = this.control.name;
    const content = this.control.value;
    // $('#summernote').summernote('code', markupStr);
    window['jQuery']('#' + eleId).summernote('code', content);
  }

  initTypeahead() {
    const queryUrl = this.control.params['queryUrl'];
    if (!queryUrl) {
      return;
    }

    const suggestions = new window['Bloodhound']({
      datumTokenizer: function(d) {
        return d.tokens;
      },
      queryTokenizer: window['Bloodhound'].tokenizers.whitespace,
      remote: {
        url: queryUrl, // '/api/action/company.searchContactIndex?query[term]=%QUERY',
        // url: "/api/action/company.searchContactIndex?query[term]=%QUERY",
        wildcard: '%QUERY'
      }
    });
    suggestions.initialize();

    const displayValue = 'name';

    window['jQuery']('#' + this.control.name)
      .typeahead(
        {
          minLength: 3,
          highlight: true,
          classNames: {
            input: 'col-md-12'
            // hint: 'Typeahead-hint', selectable: 'Typeahead-selectable'
          }
        },
        {
          name: 'typehead-lookup',
          display: displayValue,
          source: suggestions.ttAdapter()
        }
      )
      .bind('typeahead:select', (ev, suggestion) => {
        this.formControl.patchValue(suggestion[displayValue]);
        // this.control.doAction({label: 'typeahead:select', selected: suggestion});
        this.control.doAction({ label: this.control.name, value: suggestion });
      });
  } // initTypeahead

  initTimepicker() {
    const elt = window['jQuery']('#' + this.control.name)
      .timepicker({
        disableMousewheel: true,
        disableFocus: true,
        minuteStep: 15,
        showMeridian: false,
        showSeconds: false,
        defaultTime: this.control.value
      })
      .on('hide.timepicker', event => {
        this.control.value = event.time.value;
        this.form.controls[this.control.key].patchValue(this.control.value);
      });
  } // initTimepicker


  displaySuggestions(predictions, status) {
    if (status !== window['google'].maps.places.PlacesServiceStatus.OK) {
      return;
    }
    this.locationPredictions = [];
    let count = 0;
    predictions.forEach(prediction => {
      // console.log(prediction);
      count = count + 1;
      if (count < 6) {
        this.locationPredictions.push(prediction);
      }
    });
    // console.log(this.locationPredictions);
  }

  getPlaceDetails(palceID) {
    const places = new window['google'].maps.places.PlacesService(
      document.getElementById('places-map')
    );
    // console.log(places);
    places.getDetails(
      {
        placeId: palceID
      },
      details => {
        // console.log(details);
        if (details) {
          this.formControl.patchValue(details['formatted_address']);
          const place = this.parseGooglePlaceDetails(details);
          const action = { label: this.control.name, value: place };
          // console.log(action);
          this.control.doAction(action);
          return;
          /*
          this.force
            .action("tools.saveLocationFromPlaceObject", { data: place })
            .subscribe(result => {
              // console.log(result);
              if (!result.error) {
                this.control.doAction({
                  label: "onLocation",
                  data: result.data
                });
              }
            });
          */
        }
      }
    );
  }

  parseGooglePlaceDetails(placeObject) {
    const place = {
      address_components: placeObject['address_components'],
      adr_address: placeObject['adr_address'],
      formatted_address: placeObject['formatted_address'],
      icon: placeObject['icon'],
      url: placeObject['url'],
      place_id: placeObject['place_id'],
      id: placeObject['id'],
      name: placeObject['name'],
      utc_offset: placeObject['utc_offset'],
      vicinity: placeObject['vicinity'],
      location: {
        lat: placeObject.geometry.location.lat(),
        lng: placeObject.geometry.location.lng()
      }
    };
    return place;
  }

  chooseLocation(location) {
    this.getPlaceDetails(location['place_id']);
    this.lookup = false;
    // this.formControl.patchValue(location.description);
    this.locationPredictions = [];
  }

  initGooglePlacesAutoComplete() {
    this.formControl.valueChanges.subscribe(value => {
      if (value.length === 0) {
        this.lookup = true;
        this.locationPredictions = [];
      } else if (value.length > 5 && this.lookup) {
        if (value.indexOf('United States') === -1) {
          // value = value + ', United States';
          value = value + ', USA';
        }
        const service = new window['google'].maps.places.AutocompleteService();
        service.getQueryPredictions(
          {
            input: value,
            types: ['address', 'street_address']
          },
          this.displaySuggestions.bind(this)
        );
      } else {
        this.lookup = true;
      }
    });
  } // end initGooglePlacesAutoComplete

  initDatepicker() {
    window['jQuery']('#' + this.control.name)
      .datepicker({
        orientation: 'left',
        autoclose: false,
        // startView: this.control.params.startView || 'days',
        // startView: 12,
        format: this.control.params.format || 'yyyy-mm-dd', // d MM yyyy
        title: this.control.label
      })
      .on('hide', event => {
        this.control.value = event.format();
        this.form.controls[this.control.key].patchValue(this.control.value);
      });
  } // end initDatepicker


}
