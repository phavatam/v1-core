import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'antd-drawer',
  standalone: true,
  imports: [NzDrawerModule],
  template: `<nz-drawer [nzVisible]="visible" [nzTitle]="title" (nzOnClose)="onClose()"><ng-content></ng-content></nz-drawer>`
})
export class AntdDrawerComponent {
  @Input() visible = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
  onClose() { this.close.emit(); }
}
