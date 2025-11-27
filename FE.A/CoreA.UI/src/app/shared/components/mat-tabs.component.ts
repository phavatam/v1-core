import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'mat-tabs',
  standalone: true,
  imports: [MatTabsModule],
  template: `<mat-tab-group>
    <ng-content></ng-content>
  </mat-tab-group>`
})
export class MatTabsComponent {}
