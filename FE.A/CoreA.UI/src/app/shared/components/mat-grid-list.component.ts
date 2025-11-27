import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'mat-grid-list',
  standalone: true,
  imports: [MatGridListModule],
  template: `<mat-grid-list [cols]="cols" [rowHeight]="rowHeight"><ng-content></ng-content></mat-grid-list>`
})
export class MatGridListComponent {
  @Input() cols = 2;
  @Input() rowHeight = '1:1';
}
