import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {EditorFormControl} from './editor-form-control';
import {AbstractControl, FormGroup} from '@angular/forms';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-input-lookup-editor',
  templateUrl: './input-lookup-editor.component.html',
  styles: []
})
export class InputLookupEditorComponent implements OnInit, AfterViewInit {

  @Input() control: EditorFormControl<any>;
  @Input() form: FormGroup;
  @Input() layout: string;

  help: string;
  editor: AbstractControl;

  constructor() {
  }

  ngOnInit() {
    this.control.params.layout = this.layout;
    this.help = this.control.help;

    this.editor = this.form['controls'][this.control.key];
    // console.log(this.editor);
    const valueChanges$ = this.form.controls[this.control.key].valueChanges;
    valueChanges$.subscribe(e => {
      if (this.isValid) {
        this.help = this.control.params.help;
      } else {
        this.help = this.control.label + ' is required to be valid';
      }
    });
  }

  get isPristine() {
    return this.form.controls[this.control.key].pristine;
  }

  get isValid() {
    return this.form.controls[this.control.key].valid;
  }

  get isSuccessState() {
    return this.isPristine ? false : this.isValid;
  }

  get isErrorState() {
    return this.isPristine ? false : !this.isValid;
  }

  get isHorizontalLayout() {
    return true;
  }

  get isMultiple() {
    return this.control.params.multiple ? true : null;
  }

  get isOptGroup() {
    return this.control.params.optgroup ? true : false;
  }

  get isBsSelect() {
    if (this.control.params.class) {
      return this.control.params.class.indexOf('bs-select') > -1;
    }
  }

  ngAfterViewInit() {
    const _self = this;
    let currentValue;

    const ele = window['$']('#' + this.control.name);
    if (this.isMultiple) {
      ele.prop('multiple', 'true');
    }

    const lookupUrl = this.control.params['url'] || '/api/action/content.lookup_taxonomy';
    const valueKey = this.control.params['index_key'] || 'id';
    currentValue = _self.form.controls[_self.control.key].value;

    const currentUser = JSON.parse(localStorage.getItem('user_current'));
    let access_token = null;
    const headers = {};
    if (currentUser && currentUser.token) {
      access_token = currentUser.token;
      headers['Authorization'] = "Bearer " + currentUser.token;
      headers["Content-Type"] = "application/json";
    }

    ele['select2']({
      ajax: {
        url: environment.baseUrl + lookupUrl,
        data: (params) => {
          return {
            term: params.term,
            index_key: valueKey,
            selected: currentValue
          };
        },
        headers,
        dataType: 'json',
        processResults: (results) => {
          return {results: results.data || null};
        },
        /*
        transport: function(params){
          params.beforeSend = function(request){
            request.setRequestHeader("Authorization", 'Bearer ' + access_token);
          };
          return $.ajax(params);
        },
        */
      },
      // minimumResultsForSearch: 1,
      // allowClear: true,
      multiple: this.isMultiple,
      placeholder: this.control.params.placeholder || this.control.label,
      width: '100%',
      templateResult: (state) => {
        // console.log(state);
        // if (state['thumb_url']) {
        // return '<span><img src="' + state['thumb_url'] + '" class="img-flag" /> ' + state.name + '</span>';
        // }
        if (state.text) {
          return state.text;
        } else if (state.name) {
          return state.name;
        }

      }
    });

    ele.on('select2:close', (e) => {

      const value = window['jQuery'](e.target).val();
      console.log('lookup select: ' + value);
      currentValue = _self.form.controls[_self.control.key].value;

      if (this.isMultiple) {
        currentValue = value;
        /*
        if(!currentValue || typeof currentValue != 'object') currentValue = [];
        currentValue = currentValue.concat(value);
        // console.log(currentValue);
        currentValue = currentValue.filter( (v, i, self) => {
          return self.indexOf(v) === i;
        });
        */
        _self.form.controls[_self.control.key].patchValue(currentValue);

      } else {

        currentValue = value;
        _self.form.controls[_self.control.key].patchValue(value);

      }

      // console.log(currentValue);
      window['jQuery'](e.target).val(currentValue).trigger('change');


    }); // end select2:close

    // console.log(this.control.value);
    if (this.control.value) {
      let value = this.control.value;
      window['jQuery'](ele).val(value).trigger('change');

      if (this.isMultiple) {
        if (typeof value === 'string') {
          value = value.split(',');
        }
      }
      // console.log(value);
      window['jQuery'](ele).val(value).trigger('change');
      // ele['select2']('val', value);
    }


  } // ngAfterViewInit


}
