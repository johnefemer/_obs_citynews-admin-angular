import { Component, Input, Output, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { EditorFormControl } from './editor-form-control';
// import * as jquery from 'jquery';

declare let window: any;
@Component({
  moduleId: module.id,
  selector: 'dropdown-editor',
  templateUrl: 'input-dropdown-editor.component.html'
})
export class InputDropdownEditorComponent implements OnInit, AfterViewInit {
  @Input() control: EditorFormControl<any>;
  @Input() form: FormGroup;
  @Input() layout: string; // = '';

  help: string;
  editor: AbstractControl;

  constructor(private ele: ElementRef) {
    //
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
    // return this.layout === 'form-horizontal';
    // since this is a dropdown dont render this component without any dropdown choices
    return this.layout && this.layout.indexOf('horizontal') > -1; // === 'form-horizontal';
  }
  get isMultiple() {
    return this.control.params.multiple ? true : null;
  }
  get isOptGroup() {
    return this.control.params.optgroup ? true : false;
  }

  get isBsSelect() {
    return !!(
      this.control.params.class &&
      this.control.params.class.indexOf('bs-select') > -1
    );
  }
  get isSelect2() {
    return !!(
      this.control.params.class &&
      this.control.params.class.indexOf('select2') > -1
    );
  }

  ngOnInit() {

    this.control.params.layout = this.layout;
    this.help = this.control.help;

    this.editor = this.form['controls'][this.control.key];
    const valueChanges$ = this.form.controls[this.control.key].valueChanges;
    valueChanges$.subscribe(e => {
      if (this.isValid) {
        this.help = this.control.params.help;
      } else {
        this.help = this.control.label + ' is required to be valid';
      }
    });
  }

  fromControlClass() {
    if (this.isSelect2 || this.isBsSelect) {
      return 'm-select2';
    }
  }

  ngAfterViewInit() {
    const _self = this;

    // const eleName = '#' + this.control.name;
    const ele = window['$']('#' + this.control.name);

    if (this.isMultiple) {
      ele.prop('multiple', 'true');
    }

    if (this.control.options && this.control.options.length > 9) {
      ele.attr('data-live-search', 'true');
    }

    if (this.isSelect2 || this.isBsSelect) {
      ele['select2']({
        // minimumResultsForSearch: 1,
        // allowClear: true,
        // data: data,
        minimumResultsForSearch: -1,
        multiple: this.isMultiple,
        allowClear: true,
        placeholderOption: () => '',
        // maximumSelectionLength: 0,
        placeholder: this.control.params.placeholder || this.control.label,
        // tags: false, // this.isMultiple,
        width: '100%'
      });

      ele.on('select2:close', (e) => {

        const value = window['$'](e.target).val();
        let currentValue = _self.form.controls[_self.control.key].value;

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
        window['$'](e.target).val(currentValue).trigger('change');


      }); // end select2:close

      if (this.control.value) {
        let value = this.control.value;
        window['$'](ele).val(value).trigger('change');

        if (this.isMultiple) {
          if ( typeof value === 'string' ) {
            value = value.split(',');
          }
        }
        // console.log(value);
        window['$'](ele).val(value).trigger('change');
        // ele['select2']('val', value);
      }

    }

  } // ngAfterViewInit
}



    /*
    if (this.isBsSelect) {

      ele['selectpicker']({
          iconBase: 'fa',
          showIcon: false,
          showTick: false,
          tickIcon: 'fa-check',
          header: this.control.label,
          // width: 'fit',
          noneSelectedText: this.control.label,
          title: this.control.params.placeholder
            ? this.control.params.placeholder
            : this.control.label,
          size: 8
          // liveSearch: false,
        })
        .on('hidden.bs.select', function(event) {
          let eleVal: any = window['$'](event.target).val();
          if (eleVal) {
            if (typeof eleVal !== 'string') {
              eleVal = eleVal.join(',');
            }
            _self.form.controls[_self.control.key].patchValue(eleVal);
          }
        });

      let val = _self.form.controls[_self.control.key].value;
      if (this.isMultiple) {
        val = val.split(',');
      }
      ele['selectpicker']('val', val);
      ele['selectpicker']('render');
    }
    */

    /*

    var data = [{
            id: 0,
            text: 'Enhancement'
        }

              ajax: {
                url: "https://api.github.com/search/repositories",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = params.page || 1;

                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page


            function formatRepo(repo) {
            if (repo.loading) return repo.text;
            var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";
            if (repo.description) {
                markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
            }
            markup += "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
                "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
                "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
                "</div>" +
                "</div></div>";
            return markup;
        }

        function formatRepoSelection(repo) {
            return repo.full_name || repo.text;
        }


    */
