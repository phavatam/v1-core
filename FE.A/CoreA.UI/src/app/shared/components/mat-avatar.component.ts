import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mat-avatar',
  standalone: true,
  imports: [MatIconModule],
  template: `<mat-icon>{{icon}}</mat-icon>`
})
export class MatAvatarComponent {
  @Input() icon: string = 'person';
}
