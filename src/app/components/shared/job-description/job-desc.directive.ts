import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appJobDesc]',
})
export class JobDescDirective {
  // @Input() widthInput: string;
  // @HostBinding('style.width') width;
  constructor() {}
}
