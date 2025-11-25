import { Component, Input } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'antd-badge',
  standalone: true,
  imports: [NzBadgeModule],
  template: `<nz-badge [nzCount]="count" [nzStatus]="status"><ng-content></ng-content></nz-badge>`
})
export class AntdBadgeComponent {
  @Input() count = 0;
  @Input() status: 'success' | 'processing' | 'default' | 'error' | 'warning' = 'default';
}
