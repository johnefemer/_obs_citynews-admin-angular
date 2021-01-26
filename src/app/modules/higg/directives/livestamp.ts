import { Directive, ElementRef, Input, OnChanges, SimpleChange, HostListener } from '@angular/core';

@Directive({ selector: '[appLivestamp]' })
export class LivestampDirective {

    @Input() timestamp: number;

    constructor(private element: ElementRef) {
        this.live();
    }

    live() {
        // if (this.timestamp) this.timestamp = new Date().getTime();
        // window['jQuery'](this.element.nativeElement).livestamp(new Date());
    }

}
