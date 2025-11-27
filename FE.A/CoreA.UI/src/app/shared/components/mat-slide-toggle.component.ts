import { Component, Input } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'mat-slide-toggle',
  standalone: true,
  imports: [MatSlideToggleModule],
  template: `<mat-slide-toggle [checked]="checked" [disabled]="disabled">{{label}}</mat-slide-toggle>`
})
export class MatSlideToggleComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() label = '';
}
