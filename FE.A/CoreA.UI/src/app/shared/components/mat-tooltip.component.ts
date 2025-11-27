import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'mat-tooltip',
  standalone: true,
  imports: [MatTooltipModule],
  template: `<span [matTooltip]="message"><ng-content></ng-content></span>`
})
export class MatTooltipComponent {
  @Input() message = '';
}
