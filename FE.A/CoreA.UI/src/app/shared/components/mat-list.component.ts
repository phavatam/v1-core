import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'mat-list',
  standalone: true,
  imports: [MatListModule],
  template: `<mat-list><ng-content></ng-content></mat-list>`
})
export class MatListComponent {}
