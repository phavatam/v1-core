import { Component, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'mat-snackbar',
  standalone: true,
  imports: [MatSnackBarModule],
  template: ''
})
export class MatSnackbarComponent {
  @Input() message: string = '';
  @Input() action: string = '';
  @Input() duration: number = 3000;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    if (this.message) {
      this.snackBar.open(this.message, this.action, { duration: this.duration });
    }
  }
}
