import { Component, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'mat-badge',
  standalone: true,
  imports: [MatBadgeModule],
  template: `<span [matBadge]="content" [matBadgeColor]="color"><ng-content></ng-content></span>`
})
export class MatBadgeComponent {
  @Input() content = '';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
}
