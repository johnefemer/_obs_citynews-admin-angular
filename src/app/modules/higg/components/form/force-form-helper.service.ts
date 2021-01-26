import { ForceFormManifest } from './force-form-manifest';
import { ForceFormRequest } from './force-form-request';
import { ForceFormResponse } from './force-form-response';
import { ForcePageService } from './../../services/force-page.service';
import { EditorFormControl } from './editor-form-control';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PageService } from './../../services/page.service';

@Injectable()
export class ForceFormHelperService {
  constructor(private page: PageService, private force: ApiService) {}

  getForm(path: string, request?: {}): Observable<{}> {
    path = '/form/' + path;
    return this.force.req(path, request);
  }

  submitForm(path: string, request: any): Observable<ForceFormResponse> {
    path = '/form/' + path;
    return this.force.req(path, request);
  }

  formControls(formPath, req: ForceFormRequest): Observable<any> {
    return Observable.create(observer => {
      this.force.req('/form/' + formPath, req).subscribe((results: ForceFormManifest) => {
        if (results.controls) {
          const list = {};
          results.controls.forEach(control => {
            list[control.name] = control;
          });
          observer.next(list);
        }
        observer.complete();
      });
    });
  }

  toFromGroup(controls: EditorFormControl<any>[]) {
    const group: any = {};
    controls.forEach(control => {
      const value = control.value || '';
      const disabled = control.params.disabled || false;

      const rules = [];
      if (control.validators.required) {
        rules.push(Validators.required);
      }
      if (control.validators.minLength) {
        rules.push(Validators.minLength(control.validators.minLength));
      }
      if (control.validators.maxLength) {
        rules.push(Validators.maxLength(control.validators.maxLength));
      }
      if (control.validators.pattern) {
        rules.push(Validators.pattern(control.validators.pattern));
      }

      group[control.key] = new FormControl({ value: value, disabled: disabled }, rules);
    });

    return new FormGroup(group);
  } // end toFromGroup
}
