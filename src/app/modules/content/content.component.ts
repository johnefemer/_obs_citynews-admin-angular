import { Component, OnInit } from '@angular/core';
import {Store} from '@ngxs/store';
import {ActionInitData} from './_states/app.state';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styles: [
  ]
})
export class ContentComponent implements OnInit {

  constructor(
      private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new ActionInitData());
  }

}
