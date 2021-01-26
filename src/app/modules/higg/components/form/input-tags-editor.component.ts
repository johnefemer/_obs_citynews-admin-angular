import { Component, Input, Output, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { EditorFormControl } from './editor-form-control';
import { AfterContentInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'tagsinput-editor',
    templateUrl: 'input-tags-editor.component.html',
    styles: [
      `div.tagsinput span.tag {
        font-family: Poppins;
        font-weight: 300;
        color: #9c27b0 !important;
      }`
    ]
})
export class InputTagsEditorComponent implements OnInit, AfterViewInit {

    @Input() control: EditorFormControl<any>;
    @Input() form: FormGroup;
    @Input() layout: string;

    help: string;
    editor: AbstractControl;
    tagsinput: any;

    constructor() { }

    get isPristine() { return this.form.controls[this.control.key].pristine; }
    get isValid() { return this.form.controls[this.control.key].valid; }
    get isSuccessState(){ return this.isPristine ? false : this.isValid; }
    get isErrorState(){ return this.isPristine ? false : !this.isValid; }
    get isHorizontalLayout() { return true; }

    // get labelClass(){ return 'control-label col-sm-3' }

    ngOnInit() {
        //
    }

    getInputValue() {
        const value = window['jQuery']('#' + this.control.name).val();
        return value;
    }

    ngAfterViewInit() {

        const $ = window['jQuery'];

        this.tagsinput = window['jQuery']('#' + this.control.name).tagsInput(
          {
            'width': '100%',
            'height': '50',
            onChange: (element, tag) => {
                this.form.controls[this.control.key].patchValue($(element).val());
            }
            // autocomplete_url:'http://myserver.com/api/autocomplete'
            // autocomplete: { selectFirst: true, width: '100px', autoFill: true }
            /*
            'autocomplete': { option: value, option: value},
            'height':'100px',
            'width':'300px',
            'interactive':true,
            'defaultText':'add a tag',
            'onAddTag':callback_function,
            'onRemoveTag':callback_function,
            'onChange' : callback_function,
            'delimiter': [',',';'],   // Or a string with a single delimiter. Ex: ';'
            'removeWithBackspace' : true,
            'minChars' : 0,
            'maxChars' : 0, // if not provide
            */
          }
        );

        // $('#tags').importTags('foo,bar,baz');
        // if ($('#tags').tagExist('foo')) { ... }
        // $('#tags').addTag('foo');
        // $('#tags').removeTag('bar');

    }


}

