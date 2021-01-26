import { Pipe, PipeTransform, Injector } from '@angular/core';

@Pipe({
  name: 'humanizeWith'
})
export class HumanizeWithPipe implements PipeTransform {

  constructor( private injector: Injector) {}

  transform(value: any, pipeToken: any, args?: any): any {
    if (!pipeToken) {
      return value;
    } else {
      const pipe = this.injector.get(pipeToken);
      return pipe.transform(value, ...args);
    }
  }

}
