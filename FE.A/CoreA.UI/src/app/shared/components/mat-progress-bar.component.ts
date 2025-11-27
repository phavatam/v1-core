import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'mat-progress-bar',
  standalone: true,
  imports: [MatProgressBarModule],
  template: `<mat-progress-bar [value]="value" [color]="color" [mode]="mode"></mat-progress-bar>`
})
export class MatProgressBarComponent {
  @Input() value = 0;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() mode: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'determinate';
}
