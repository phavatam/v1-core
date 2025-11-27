import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mat-icon',
  standalone: true,
  imports: [MatIconModule],
  template: `<mat-icon [color]="color">{{name}}</mat-icon>`
})
export class MatIconComponent {
  @Input() name = '';
  @Input() color: 'primary' | 'accent' | 'warn' | undefined;
}
