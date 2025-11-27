import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'mat-chip',
  standalone: true,
  imports: [MatChipsModule],
  template: `<mat-chip [color]="color" [selected]="selected">{{label}}</mat-chip>`
})
export class MatChipComponent {
  @Input() label = '';
  @Input() color: 'primary' | 'accent' | 'warn' | undefined;
  @Input() selected = false;
}
