import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'antd-button',
  standalone: true,
  imports: [NzButtonModule],
  template: `<button nz-button [nzType]="type" [disabled]="disabled"><ng-content></ng-content></button>`
})
export class AntdButtonComponent {
  @Input() type: 'primary' | 'default' | 'dashed' | 'link' = 'default';
  @Input() disabled = false;
}
