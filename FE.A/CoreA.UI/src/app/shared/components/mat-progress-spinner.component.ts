import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'mat-progress-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `<mat-progress-spinner [color]="color" [mode]="mode" [value]="value"></mat-progress-spinner>`
})
export class MatProgressSpinnerComponent {
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() mode: 'determinate' | 'indeterminate' = 'indeterminate';
  @Input() value = 0;
}
