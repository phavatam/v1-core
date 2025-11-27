import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'mat-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `<ng-content></ng-content>`
})
export class MatDialogComponent {
  @Input() visible = false;
  @Input() title = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() ok = new EventEmitter<void>();
}
