import { Component, Input } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'mat-button-toggle',
  standalone: true,
  imports: [MatButtonToggleModule],
  template: `<mat-button-toggle-group [value]="value" [disabled]="disabled">
    <ng-content></ng-content>
  </mat-button-toggle-group>`
})
export class MatButtonToggleComponent {
  @Input() value: any;
  @Input() disabled = false;
}
