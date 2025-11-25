import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'antd-pagination',
  standalone: true,
  imports: [NzPaginationModule],
  template: `<nz-pagination [nzPageIndex]="pageIndex" [nzTotal]="total" [nzPageSize]="pageSize" (nzPageIndexChange)="onPageChange($event)"></nz-pagination>`
})
export class AntdPaginationComponent {
  @Input() pageIndex = 1;
  @Input() total = 0;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
