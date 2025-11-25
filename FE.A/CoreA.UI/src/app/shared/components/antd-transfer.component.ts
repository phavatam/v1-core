import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzTransferModule } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'antd-transfer',
  standalone: true,
  imports: [NzTransferModule],
  template: `<nz-transfer [nzDataSource]="dataSource" [nzDisabled]="disabled" (nzChange)="onChange($event)"></nz-transfer>`
})
export class AntdTransferComponent {
  @Input() dataSource: any[] = [];
  @Input() disabled = false;
  @Output() change = new EventEmitter<any>();
  onChange(event: any) { this.change.emit(event); }
}
