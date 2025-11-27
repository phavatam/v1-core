import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'mat-menu',
  standalone: true,
  imports: [MatMenuModule],
  template: `<mat-menu><ng-content></ng-content></mat-menu>`
})
export class MatMenuComponent {}
