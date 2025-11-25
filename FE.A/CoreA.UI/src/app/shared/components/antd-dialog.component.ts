import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'antd-dialog',
  standalone: true,
  imports: [NzModalModule],
  template: `
    <nz-modal [nzVisible]="visible" [nzTitle]="title" [nzFooter]="null" (nzOnCancel)="onCancel()">
      <ng-content></ng-content>
    </nz-modal>
  `
})
export class AntdDialogComponent {
  @Input() visible = false;
  @Input() title = '';
  @Output() cancel = new EventEmitter<void>();

  onCancel() { this.cancel.emit(); }
}
