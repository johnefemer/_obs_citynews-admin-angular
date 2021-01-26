import { Component, Input, Output, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { EditorFormControl } from './editor-form-control';

@Component({moduleId: module.id, selector: 'force-text-editor', templateUrl: 'force-text-editor.component.html'})
export class ForceTextEditorComponent implements OnInit {

    @Input() control: EditorFormControl < any >;
    @Input() form: FormGroup;
    @Input() layout: string;

    help: string;
    editor: AbstractControl;

    constructor() {}

    get isPristine() {
        return this.form.controls[this.control.key].pristine;
    }
    get isValid() {
        return this.form.controls[this.control.key].valid;
    }
    get isSuccessState() {
        return this.isPristine
            ? false
            : this.isValid;
    }
    get isErrorState() {
        return this.isPristine
            ? false
            : !this.isValid;
    }
    // get isHorizontalLayout() { return this.layout && this.layout == 'horizontal';
    // }
    get isHidden() {
        if (this.control.params.type) {
            return this.control.params.type === 'hidden';
        }
        return false;
    }

    isLargeText() {
        return this.control.params.type === 'textarea';
    }
    isDatepicker() {
        return (this.control.params.class && this.control.params.class.indexOf('dateinput') > -1);
    }
    isTagsinput() {
        return (this.control.params.class && this.control.params.class.indexOf('tagsinput') > -1);
    }
    isColorpicker() {
        return (this.control.params.class && this.control.params.class.indexOf('colorpicker') > -1);
    }
    isTimepicker() {
        return (this.control.params.class && this.control.params.class.indexOf('timepicker') > -1);
    }
    isPlacesAutocomplete() {
        return (this.control.params.class && this.control.params.class.indexOf('places-autocomplete') > -1);
    }

    ngOnInit() {

        if (this.isLargeText()) {
            this.control.params.class = this.control.params.class || 'autosizeme';
        } else {
            setTimeout(() => {
                this.initDatepicker();
                this.initTimepicker();
            }, 2000);
        }

        if (this.isColorpicker()) {
            // this.control.params.rightAddon = '<span class="add-on"><i
            // [style.backgroundColor]="control.value"></i></span>';
        }

        if (this.isTagsinput()) {
            this.control.params.floatingLabel = false;
            this.control.params.formGroup = 'form-control input-large';
        }

        this.help = this.control.params.help;
        this.editor = this.form['controls'][this.control.key];
        const valueChanges$ = this.form.controls[this.control.key].valueChanges;
        valueChanges$.subscribe(e => {
            if (this.isValid) {
                this.control.params.state = 'success';
                this.help = this.control.params.help;
            } else {
                this.control.params.state = 'error';
                if (this.editor.errors['required']) {
                    this.help = this.control.label + ' must have something.';
                } else if (this.editor.errors['minlength']) {
                    this.help = 'Try entering longer value for ' + this.control.label;
                } else if (this.editor.errors['maxlength']) {
                    this.help = this.control.label + ' needs to be shorter.';
                } else {
                    this.help = 'Please provide something respective to ' + this.control.label;
                }
            }
        });

    }

    /*
    ngAfterViewChecked() {
        this.initLargeTextEditor();
        this.initDatepicker();
        this.initColorpicker();
        this.initTagsInput();
        this.initTimepicker();
    }
    */

    initTimepicker() {
        if (this.isTimepicker()) {
            const elt = window['jQuery']('#' + this.control.name)
                .timepicker({
                disableMousewheel: true,
                disableFocus: true,
                minuteStep: 15,
                showMeridian: false,
                showSeconds: false,
                defaultTime: this.control.value
            })
                .on('hide.timepicker', (event) => {
                    this.control.value = event.time.value;
                    this
                        .form
                        .controls[this.control.key]
                        .patchValue(this.control.value);
                });
        }
    }

    initTagsInput() {
        if (this.isTagsinput()) {
            const elt = window['jQuery']('#' + this.control.name);
            // console.log(elt);

            elt.tagsinput({itemValue: 'value', itemText: 'text'});
            elt.tagsinput('add', {
                'value': 1,
                'text': 'Amsterdam',
                'continent': 'Europe'
            });
            elt.tagsinput('add', {
                'value': 4,
                'text': 'Washington',
                'continent': 'America'
            });
            elt.tagsinput('add', {
                'value': 7,
                'text': 'Sydney',
                'continent': 'Australia'
            });
            elt.tagsinput('add', {
                'value': 10,
                'text': 'Beijing',
                'continent': 'Asia'
            });
            elt.tagsinput('add', {
                'value': 13,
                'text': 'Cairo',
                'continent': 'Africa'
            });
        }
    }

    initLargeTextEditor() {
        if (this.isLargeText()) {
            const className = this.control.params.class;
            const eleId = this.control.name;
            if (className.indexOf('autosizeme') > -1) {
                window['autosize'](document.querySelector('#' + eleId));
            } else if (className.indexOf('markdown') > -1) {
                // console.log('markdown');
                // $("#some-textarea").markdown({autofocus:false,savable:false})
                window['jQuery']('#' + eleId).markdown({autofocus: false, savable: false});
            }
        }
    }

    initColorpicker() {
        if (this.isColorpicker()) {
            // window['jQuery']('input.colorpicker').colorpicker().bind('changeColor', event
            // => {
            window['jQuery']('#' + this.control.name)
                .colorpicker()
                .bind('hide', event => {
                    this.control.value = event
                        .color
                        .toHex();
                    this
                        .form
                        .controls[this.control.key]
                        .patchValue(this.control.value);
                    return false;
                });
        }
    }

    placesAutocomplete() {
        if (this.isPlacesAutocomplete()) {
            return 'hide';
        }
    }

    initDatepicker() {
        if (this.isDatepicker()) {
            //const classnames = this.control.params.class;
            // console.log(classnames);
            // if (classnames.indexOf('datepicker') > -1) {
                window['jQuery']('#' + this.control.name)
                    .datepicker({
                        todayHighlight: true,
                        orientation: "bottom left",
                        templates: {
                            leftArrow: '<i class="la la-angle-left"></i>',
                            rightArrow: '<i class="la la-angle-right"></i>'
                        },    
                        // orientation: 'left',
                        // autoclose: false,
                        // startView: this.control.params.startView || 'month',
                        format: this.control.params.format || 'yyyy-mm-dd', // d MM yyyy
                        title: this.control.label
                    })
                    .on('hide', (event) => {
                        this.control.value = event.format();
                        this
                            .form
                            .controls[this.control.key]
                            .patchValue(this.control.value);
                    });
            // }
        }
    }

}
