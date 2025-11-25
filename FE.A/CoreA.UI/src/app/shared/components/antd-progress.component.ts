import { Component, Input } from '@angular/core';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'antd-progress',
  standalone: true,
  imports: [NzProgressModule],
  template: `<nz-progress [nzPercent]="percent" [nzStatus]="status"></nz-progress>`
})
export class AntdProgressComponent {
  @Input() percent = 0;
  @Input() status: 'normal' | 'exception' | 'active' | 'success' = 'normal';
}
