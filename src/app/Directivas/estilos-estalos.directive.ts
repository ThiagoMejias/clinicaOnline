import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';


@Directive({
  selector: '[appEstilosEstados]'
})
export class EstilosEstadosDirective implements OnInit {

  @Input('appEstilosEstados') estado: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }
 

  ngOnInit(): void {
    console.log("AAA");

    this.renderer.removeClass(this.el.nativeElement, 'primary');
    this.renderer.removeClass(this.el.nativeElement, 'danger');

    if (this.estado === 'en espera' || this.estado === 'aceptado' || this.estado === 'finalizado') {
      this.renderer.addClass(this.el.nativeElement, 'primary');
    } else if (this.estado === 'cancelado' || this.estado === 'rechazado') {
      this.renderer.addClass(this.el.nativeElement, 'danger');
    }
  }

}
