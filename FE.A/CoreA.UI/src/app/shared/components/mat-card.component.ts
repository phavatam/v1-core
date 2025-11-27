import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'mat-card',
  standalone: true,
  imports: [MatCardModule],
  template: `<mat-card><mat-card-title>{{title}}</mat-card-title><mat-card-content><ng-content></ng-content></mat-card-content></mat-card>`
})
export class MatCardComponent {
  @Input() title = '';
}
