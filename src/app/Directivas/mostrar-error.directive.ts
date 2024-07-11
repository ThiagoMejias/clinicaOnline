import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription , fromEvent } from 'rxjs';

@Directive({
  selector: '[appMostrarError]'
})
export class MostrarErrorDirective implements OnChanges {

  @Input('appMostrarError') nombreControlForm!: string;
  @Input('form') form!: FormGroup;
  private statusChangesSubscription!: Subscription;
  private blurEventSubscription!: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  ngOnChanges(changes: SimpleChanges): void {
    const control = this.form.get(this.nombreControlForm);
    if (changes['formGroup'] || changes['controlName']) {
      if (control) {  
        this.updateVisibility(control.invalid && control.touched);
      }
    }
  }

  private updateVisibility(show: boolean): void {
    if (show) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}
