import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mBadge'
})
export class MBadgePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return `<span class="m-badge m-badge--wide m-badge--success"> ${value} </span>`;
  }

}
