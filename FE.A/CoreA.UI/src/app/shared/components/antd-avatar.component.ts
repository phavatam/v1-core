import { Component, Input } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'antd-avatar',
  standalone: true,
  imports: [NzAvatarModule],
  template: `<nz-avatar [nzSrc]="src" [nzText]="text" [nzSize]="size"></nz-avatar>`
})
export class AntdAvatarComponent {
  @Input() src = '';
  @Input() text = '';
  @Input() size: 'large' | 'small' | 'default' = 'default';
}
