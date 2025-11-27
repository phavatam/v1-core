import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'mat-sidenav',
  standalone: true,
  imports: [MatSidenavModule],
  template: `<mat-sidenav [opened]="opened" [mode]="mode"><ng-content></ng-content></mat-sidenav>`
})
export class MatSidenavComponent {
  @Input() opened = false;
  @Input() mode: 'over' | 'push' | 'side' = 'side';
}
