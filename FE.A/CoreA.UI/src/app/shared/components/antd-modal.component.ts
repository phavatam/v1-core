import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'antd-modal',
  standalone: true,
  imports: [NzModalModule],
  template: `
    <nz-modal [nzVisible]="visible" [nzTitle]="title" (nzOnCancel)="onCancel()" (nzOnOk)="onOk()">
      <ng-content></ng-content>
    </nz-modal>
  `
})
export class AntdModalComponent {
  @Input() visible = false;
  @Input() title = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() ok = new EventEmitter<void>();

  onCancel() { this.cancel.emit(); }
  onOk() { this.ok.emit(); }
}
