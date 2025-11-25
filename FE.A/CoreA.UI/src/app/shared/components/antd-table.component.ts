import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'antd-table',
  standalone: true,
  imports: [NzTableModule],
  template: `
    <nz-table [nzData]="data" [nzBordered]="bordered" [nzLoading]="loading">
      <ng-content></ng-content>
    </nz-table>
  `
})
export class AntdTableComponent {
  @Input() data: any[] = [];
  @Input() bordered = false;
  @Input() loading = false;
}
