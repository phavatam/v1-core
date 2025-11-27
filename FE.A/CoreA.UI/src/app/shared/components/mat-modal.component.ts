import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'mat-modal',
  standalone: true,
  imports: [MatDialogModule],
  template: `<ng-content></ng-content>`
})
export class MatModalComponent {
  @Input() visible = false;
  @Input() title = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() ok = new EventEmitter<void>();
}
