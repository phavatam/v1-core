import { Component, Input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'mat-checkbox',
  standalone: true,
  imports: [MatCheckboxModule],
  template: `<mat-checkbox [checked]="checked" [disabled]="disabled">{{label}}</mat-checkbox>`
})
export class MatCheckboxComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() label = '';
}
