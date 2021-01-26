import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluck'
})
export class PluckPipe implements PipeTransform {
  transform(value: Object, key: string, defaultValue?: string): any {
    const defaulyValue = defaultValue || '';

    if (value === null || value === undefined || value === '' || typeof value !== 'object') {
      return '';
    }

    let ref = value;
    key.split('.').forEach(part => {
      if (ref && ref[part]) {
        ref = ref[part];
      } else {
        ref = defaultValue;
      }
    });

    return ref;
  }
}
