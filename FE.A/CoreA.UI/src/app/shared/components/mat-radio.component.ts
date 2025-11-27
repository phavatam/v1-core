import { Component, Input } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'mat-radio',
  standalone: true,
  imports: [MatRadioModule],
  template: `<mat-radio-button [checked]="checked" [disabled]="disabled">{{label}}</mat-radio-button>`
})
export class MatRadioComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() label = '';
}
