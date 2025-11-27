import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'mat-toolbar',
  standalone: true,
  imports: [MatToolbarModule],
  template: `<mat-toolbar [color]="color"><ng-content></ng-content></mat-toolbar>`
})
export class MatToolbarComponent {
  @Input() color: 'primary' | 'accent' | 'warn' | undefined;
}
