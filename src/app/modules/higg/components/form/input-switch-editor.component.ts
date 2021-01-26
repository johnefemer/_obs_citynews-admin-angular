import { Component, Input, Output, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { EditorFormControl } from './editor-form-control';

@Component({
    moduleId: module.id,
    selector: 'switch-editor',
    templateUrl: 'input-switch-editor.component.html'
})
export class InputSwitchEditorComponent implements OnInit {

    @Input() control: EditorFormControl<any>;
    @Input() form: FormGroup;
    @Input() layout: string;

    help: string;
    editor: AbstractControl;
    tagsinput: any;
    switch: any;

    constructor(){ }

    get isPristine() { return this.form.controls[this.control.key].pristine; }
    get isValid() { return this.form.controls[this.control.key].valid; }
    get isSuccessState(){ return this.isPristine ? false : this.isValid; }
    get isErrorState(){ return this.isPristine ? false : !this.isValid; }
    get isHorizontalLayout() { return true; }

    get labelClass(){ return 'control-label col-sm-3'; }

    ngOnInit() {
        //
    }

    getInputValue() {
        const value = window['jQuery']('#'  + this.control.name).val();
        return value;
    }

    _ngAfterViewChecked() {
        this.switch = window['jQuery']('#' + this.control.name).bootstrapSwitch(
            {
                onText: 'Yes',
                offText: 'No',
                animate: true,
                state: parseInt(this.control.value, 10) ? true : false
            }
        ).on('switchChange.bootstrapSwitch', (event, state) => {
            this.control.value = state ? 1 : 0;
            this.form.controls[this.control.key].patchValue(this.control.value);
        });
/*
this.options = $.extend({}, $.fn.bootstrapSwitch.defaults, options, {
          state: this.$element.is(":checked"),
          size: this.$element.data("size"),
          animate: this.$element.data("animate"),
          disabled: this.$element.is(":disabled"),
          readonly: this.$element.is("[readonly]"),
          indeterminate: this.$element.data("indeterminate"),
          onColor: this.$element.data("on-color"),
          offColor: this.$element.data("off-color"),
          onText: this.$element.data("on-text"),
          offText: this.$element.data("off-text"),
          labelText: this.$element.data("label-text"),
          baseClass: this.$element.data("base-class"),
          wrapperClass: this.$element.data("wrapper-class")
        });
*/
        // .on('switchChange.bootstrapSwitch', function(event, state){ console.log(state); });
    }


}
