import { Component, Input, Output, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { EditorFormControl } from './editor-form-control';

@Component({
    moduleId: module.id,
    selector: 'daterange-editor',
    templateUrl: 'input-date-range-editor.component.html'
})
export class InputDateRangeEditorComponent implements OnInit, AfterContentInit {

    @Input() control: EditorFormControl<any>;
    @Input() form: FormGroup;
    @Input() layout: string;

    help: string;
    editor: AbstractControl;
    daterange: { start_date: string, end_date: string } = { start_date: '', end_date: '' };

    constructor() { }

    get isPristine() { return this.form.controls[this.control.key].pristine; }
    get isValid() { return this.form.controls[this.control.key].valid; }
    get isSuccessState(){ return this.isPristine ? false : this.isValid; }
    get isErrorState(){ return this.isPristine ? false : !this.isValid; }
    get isHorizontalLayout() { return true; }

    get labelClass(){ return 'control-label col-sm-3'; }

    ngOnInit() {
        //
    }

    ngAfterContentInit() {
        this.initDatepicker();
    }

    initDatepicker() {
        // console.log('#'+this.control.name);
        // window['jQuery']('#'+this.control.name).datepicker({
        window['jQuery']('.input-daterange').datepicker({
            orientation: 'left',
            autoclose: false,
            startView: this.control.params.startView || 'month',
            format: this.control.params.format || 'yyyy-mm-dd',     // d MM yyyy
            title: this.control.label
        }).on('hide', (event) => {
            const name = event['target']['name'];
            if (name === 'from') {
                this.daterange.start_date = event['format']();
            } else if (name === 'to') {
                this.daterange.end_date = event['format']();
            }
            this.control.value = this.daterange.start_date + ',' + this.daterange.end_date;
            this.form.controls[this.control.key].patchValue(this.control.value);
        });
    }


}
