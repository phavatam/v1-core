import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mat-button',
  standalone: true,
  imports: [MatButtonModule],
  template: `<button mat-button [color]="color" [disabled]="disabled"><ng-content></ng-content></button>`
})
export class MatButtonComponent {
  @Input() color: 'primary' | 'accent' | 'warn' | undefined;
  @Input() disabled = false;
}
