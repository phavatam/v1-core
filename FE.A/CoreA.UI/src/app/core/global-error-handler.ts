import { ErrorHandler, Injectable } from '@angular/core';
import { NotifyService } from './services/notify.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private notify: NotifyService) {}

  handleError(error: any): void {
    // Show toast and log error
    this.notify.error('Đã xảy ra lỗi hệ thống!');
    console.error('Global Error:', error);
  }
}
