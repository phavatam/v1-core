import { Component, Input } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'antd-tag',
  standalone: true,
  imports: [NzTagModule],
  template: `<nz-tag [nzColor]="color">{{text}}</nz-tag>`
})
export class AntdTagComponent {
  @Input() text = '';
  @Input() color = '';
}
