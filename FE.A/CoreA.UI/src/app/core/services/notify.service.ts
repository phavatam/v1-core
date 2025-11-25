import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  constructor(private notification: NzNotificationService) {}

  success(msg: string): void {
    this.notification.success('Success', msg, { nzPlacement: 'topRight' });
  }

  error(msg: string): void {
    this.notification.error('Error', msg, { nzPlacement: 'topRight' });
  }

  info(msg: string): void {
    this.notification.info('Info', msg, { nzPlacement: 'topRight' });
  }

  warning(msg: string): void {
    this.notification.warning('Warning', msg, { nzPlacement: 'topRight' });
  }
}
