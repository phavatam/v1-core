import { Component, Input } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'antd-alert',
  standalone: true,
  imports: [NzAlertModule],
  template: `<nz-alert *ngIf="message" [nzType]="type" [nzMessage]="message" nzShowIcon></nz-alert>`
})
export class AntdAlertComponent {
  @Input() type: 'success' | 'info' | 'warning' | 'error' = 'info';
  @Input() message: string = '';
}
