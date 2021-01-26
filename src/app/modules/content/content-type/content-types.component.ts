import { Component, OnInit } from '@angular/core';

import {Actions} from '@ngxs/store';
import {Router} from '@angular/router';
import {PageService} from '../../higg/services/page.service';
import {BrowserOptions} from '../../higg/objects/browser-options';
import {ForceFormRequest} from '../../higg/components/form/force-form-request';

@Component({
    selector: 'app-content-types',
    templateUrl: './content-types.component.html',
    styles: []
})
export class ContentTypesComponent implements OnInit {

    formTitle: string;
    formPath: string;
    formReq: ForceFormRequest;

    browserState: {};
    browserOptions: BrowserOptions;
    activeContentType: {};

    constructor(
        private page: PageService,
        private router: Router,
        private actions$: Actions) {

        // this.actions$.pipe( ofActionDispatched(ActionLoadTaxonomyTypes) ).subscribe( () => {
        //   this.browserState = { action: 'reload' };
        // });
        //
    }

    ngOnInit() {
        this.initForm();
        this.initBrowser();
    }

    initForm() {
        this.formPath = 'content_type.register-form';
        this.formTitle = 'Content Type';
        this.formReq = new ForceFormRequest();
    }

    initBrowser() {
        this.browserOptions = new BrowserOptions({ table: 'content_type', where: {}, page: 1, limit: 10, columns: true });
    }

    onResponse(response) {
        this.page.toastrAlert(response);
        this.browserState = { action: 'reload' };
        // this.page.store().dispatch(new ActionLoadTaxonomyTypes());
    }

    onAction(action) {

        switch (action.action) {

            case 'edit':
                this.activeContentType = action.row;
                this.formReq = new ForceFormRequest( {}, { id: this.activeContentType['id'] });
                break;

            case 'new':
                this.formReq = new ForceFormRequest( {}, {});
                break;

            case 'browse':
                // this.router.navigateByUrl(`/content/taxonomies?taxonomy_type=${action.row.slug}`).then();
                break;

        }

    }

}
