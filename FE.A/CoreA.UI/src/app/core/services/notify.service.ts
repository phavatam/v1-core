import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  constructor(private snackBar: MatSnackBar) {}

  success(msg: string): void {
    this.snackBar.open(msg, 'Success', { duration: 3000, panelClass: ['snackbar-success'] });
  }

  error(msg: string): void {
    this.snackBar.open(msg, 'Error', { duration: 3000, panelClass: ['snackbar-error'] });
  }

  info(msg: string): void {
    this.snackBar.open(msg, 'Info', { duration: 3000, panelClass: ['snackbar-info'] });
  }

  warning(msg: string): void {
    this.snackBar.open(msg, 'Warning', { duration: 3000, panelClass: ['snackbar-warning'] });
  }
}
