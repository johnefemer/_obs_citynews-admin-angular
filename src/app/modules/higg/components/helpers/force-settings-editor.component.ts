import { ForceFormResponse } from './../form/force-form-response';
import { ForceFormRequest } from './../form/force-form-request';
import { Component, OnInit, Input } from '@angular/core';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-force-settings-editor',
  templateUrl: './force-settings-editor.component.html',
  styles: []
})
export class ForceSettingsEditorComponent implements OnInit {
  @Input() namespaces: [{ namespace: string; label: string }];
  @Input() owner: string;
  // @Input() ownerType = 'business';

  settingFormPath: string;
  settingFormTitle: string;
  settingFormReq: ForceFormRequest;

  currentNamespace: string;

  constructor(private _page: PageService) {}

  ngOnInit() {}

  get ownerType() {
    if (this.owner) {
      let index = this.owner.indexOf(':');
      return this.owner.slice(0, index);
    }
    return 'business';
  }

  initSettingForm(namespace) {
    if (!this.owner) return;
    this.currentNamespace = namespace;
    this.settingFormPath = this.ownerType + '.setting.' + namespace['namespace'] + '-settings';
    this.settingFormTitle = namespace['label'] + ' Settings';

    let query = { setting_namespace: namespace['namespace'] };
    if (this.owner) {
      query['owner'] = this.owner;
    }

    this.settingFormReq = new ForceFormRequest({}, query);
  }

  onSettingForm(res: ForceFormResponse) {
    //
  }
} //
