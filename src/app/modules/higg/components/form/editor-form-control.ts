import { FormGroup } from '@angular/forms';

export class EditorFormControl<T> {

    public handle: any;

    value: T;
    key: string;
    name: string;
    label: string;
    validators: {
        required?: boolean,
        minLength?: number,
        maxLength?: number,
        pattern?: string
    };
    order: number;
    options?: Array < any >;
    readonly?: boolean;
    editor: string;
    actions: any;
    params: {
        type?: string,
        class?: string,
        inputGroup?: string,
        formGroup?: string,
        format?: string,
        filetype?: string,
        csrf?: string,
        startView?: string,
        leftIcon?: string,
        rightIcon?: string,
        leftAddon?: string,
        rightAddon?: string,
        leftButton?: string,
        rightButton?: string,
        floatingLabel?: boolean,
        state?: string,
        horizontal?: boolean,
        placeholder?: string,
        help?: string,
        col?: string,
        disabled?: boolean,
        multiple?: boolean,
        optgroup?: boolean,
        layout?: string
    };

    constructor( options: {
        value?: T,
        key?: string,
        name?: string,
        label?: string,
        validators?: {
            required?: boolean,
            minLength?: number,
            maxLength?: number,
            pattern?: string
        },
        order?: number,
        options?: Array <any>,
        editor?: string,
        readonly?: boolean,
        actions?: any,
        params?: {
            type?: string,
            class?: string,
            url?: string,
            inputGroup?: string,
            formGroup?: string,
            format?: string,
            filetype?: string,
            csrf?: string,
            startView?: string,
            leftIcon?: string,
            rightIcon?: string,
            leftAddon?: string,
            rightAddon?: string,
            leftButton?: string,
            rightButton?: string,
            floatingLabel?: boolean,
            state?: string,
            horizontal?: boolean,
            placeholder?: string,
            help?: string,
            col?: string,
            disabled?: boolean,
            multiple?: boolean,
            optgroup?: boolean,
            layout?: string
        }
    } = {}) {

        this.value = options.value;
        this.key = options.key || '';
        this.name = options.name || '';
        this.label = options.label || '';
        this.validators = options.validators || {};
        this.order = options.order === undefined
            ? 1
            : options.order;
        this.options = options.options || [];
        this.readonly = options.readonly || false;
        this.editor = options.editor || 'text';
        this.actions = options.actions || false;
        this.params = options.params || {};

    } // end constructor

    isText() {
        return this.editor === 'text';
    }
    isDropdown() {
        return this.editor === 'dropdown';
    }
    isFileInput() {
        return this.editor === 'fileinput';
    }
    isTagsinput() {
        return this.editor === 'tagsinput';
    }
    isLookUp() {
        return this.editor === 'lookup';
    }
    isSwitch() {
        return this.editor === 'switch';
    }
    isDateRange() {
        return this.editor === 'daterange';
    }

    get isButtonLayout() {
        return this.leftButton || this.rightButton;
    }
    get isAddonLayout() {
        return this.leftAddon || this.rightAddon;
    }
    get isIconLayout() {
        return this.leftIcon || this.rightIcon;
    }
    get isReadonly() {
        return this.readonly || false;
    }

    get hasFloatingLabel() {
        return this.params.floatingLabel || true;
    }
    get isHorizontal() {
        return this.params.horizontal || false;
    }
    get editorType() {
        return this.params.type || 'text';
    }
    get edited() {
        return !!this.value;
    }
    get disabled() {
        return this.params.disabled || false;
    }

    get leftIcon() {
        return this.params.leftIcon || false;
    }
    get rightIcon() {
        return this.params.rightIcon || false;
    }
    get leftAddon() {
        return this.params.leftAddon || false;
    }
    get rightAddon() {
        return this.params.rightAddon || false;
    }
    get leftButton() {
        return this.params.leftButton || false;
    }
    get rightButton() {
        return this.params.rightButton || false;
    }
    get withButton() {
        return this.leftButton || this.rightButton;
    }
    get placeholder() {
        return this.params.placeholder || '';
    }
    get help() {
        return this.params.help || '';
    }
    get leftAddonContent() {
        return this.addonContent(true);
    }
    get rightAddonContent() {
        return this.addonContent(false);
    }

    get col() {
        switch (this.params.col) {
            case 'full':
                return 'col-sm-12';
            case 'half':
                return 'col-sm-6';
            case 'third':
                return 'col-sm-4';
            case 'forth':
                return 'col-sm-3';
            default:
                return 'col-sm-12';
        }
    }

    get state() {
        return this.params.state || false;
    }
    get icon() {
        if (this.isIconLayout) {
            return this.leftIcon
                ? this.leftIcon
                : this.rightIcon;
        }
        return '<i class="icon-pencil"><i>';
    }

    addonContent(left: boolean = false) {
        const addon = left ? this.params.leftAddon : this.params.rightAddon;
        if (!addon) {
          return '';
        }
        const addonStr = addon.toString();
        if (addonStr.startsWith('fa')) {
            return '<i class="' + addon + '"></i>';
        } else if (addonStr.startsWith('icon')) {
            return '<i class="' + addon + '"></i>';
        }
        return addonStr;
    }

    get formGroup() {
        if (this.params.formGroup) {
            return this.params.formGroup;
        }
        // let classNames = ' form-group form-md-line-input m-form__group';
        let classNames = 'form-group m-form__group';
        // if (this.hasFloatingLabel) { classNames += ' form-md-floating-label '; }
        if (this.params.layout) { classNames += ' row '; }

        if (this.state) {
          classNames += 'has-' + this.state; // has-success
        }
        return classNames;
    }

    get formControl() {
      let className = 'form-control'; //  m-input
      if (this.isReadonly) {
        className += ' form-control-static';
      }
      if (this.params.class)  {
        className += ' ' + this.params.class;
      }
      return className;
    }

    get inputGroup() {
        let className = this.params.inputGroup || ' input-group';
        if (this.isIconLayout) {
            return this.rightIcon ? ' input-icon right' : ' input-icon';
        } else if (this.isAddonLayout) {
            if (this.leftAddon) {
              className += ' left-addon ';
            }
            if (this.rightAddon) {
              className += ' right-addon ';
            }
            return className;
        } else if (this.isButtonLayout) {
            return className;
        }
        return '';
    }


    get hasActions() {
        return !!this.actions;
    }

    doAction(action) {
        if (this.handle) {
            action.control = this;
            this.handle(action);
        }
    }

    initDatepicker(form: FormGroup) {
        window['jQuery']('#' + this.name)
            .datepicker({
            orientation: 'left',
            autoclose: false,
            startView: this.params.startView || 'month',
            format: this.params.format || 'yyyy-mm-dd', // d MM yyyy
            title: this.label
        })
            .on('hide', (event) => {
                this.value = event.format();
                form
                    .controls[this.key]
                    .patchValue(this.value);
            });

    } // end initDatepicker

}
