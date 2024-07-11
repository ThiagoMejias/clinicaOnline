import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[ImagenRedondeada]'
})
export class ImagenRedondeada implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'width', '50px');
    this.renderer.setStyle(this.el.nativeElement, 'height', '50px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '50%');
    this.renderer.setStyle(this.el.nativeElement, 'object-fit', 'cover');
  }
}
