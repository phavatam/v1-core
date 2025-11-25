import { Component, Input } from '@angular/core';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'antd-popover',
  standalone: true,
  imports: [NzPopoverModule],
  template: `<span nz-popover [nzPopoverTitle]="title" [nzPopoverContent]="content"><ng-content></ng-content></span>`
})
export class AntdPopoverComponent {
  @Input() title = '';
  @Input() content = '';
}
