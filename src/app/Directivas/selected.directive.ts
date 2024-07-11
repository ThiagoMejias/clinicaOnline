import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[selected]'
})
export class SelectedDirective {

  @Input('selected') selectedCondition: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    if (this.selectedCondition) {
      this.renderer.addClass(this.el.nativeElement, 'selected');
    }
  }

}
