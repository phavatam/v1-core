import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'antd-card',
  standalone: true,
  imports: [NzCardModule],
  template: `
    <nz-card [nzTitle]="title" [nzBordered]="bordered">
      <ng-content></ng-content>
    </nz-card>
  `
})
export class AntdCardComponent {
  @Input() title = '';
  @Input() bordered = true;
}
