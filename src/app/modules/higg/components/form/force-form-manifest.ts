import { EditorFormControl } from './editor-form-control';

export interface ForceFormManifest {
    config?: {};
    actions?: Array<any>;
    tools?: Array<any>;
    controls?: Array<EditorFormControl<any>>;
    data?: {};
    query?: {};
}
