import { Component, Input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'mat-slider',
  standalone: true,
  imports: [MatSliderModule],
  template: `<mat-slider [min]="min" [max]="max" [step]="step" [value]="value" [disabled]="disabled"></mat-slider>`
})
export class MatSliderComponent {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() value = 0;
  @Input() disabled = false;
}
