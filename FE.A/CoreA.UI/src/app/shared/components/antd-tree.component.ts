import { Component, Input } from '@angular/core';
import { NzTreeModule } from 'ng-zorro-antd/tree';

@Component({
  selector: 'antd-tree',
  standalone: true,
  imports: [NzTreeModule],
  template: `<nz-tree [nzData]="data"></nz-tree>`
})
export class AntdTreeComponent {
  @Input() data: any[] = [];
}
