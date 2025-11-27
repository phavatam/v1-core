import { Component } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

@Component({
  selector: 'mat-bottom-sheet',
  standalone: true,
  imports: [MatBottomSheetModule],
  template: `<ng-content></ng-content>`
})
export class MatBottomSheetComponent {}
