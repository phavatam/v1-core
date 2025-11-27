import { Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'mat-select',
  standalone: true,
  imports: [MatSelectModule],
  template: `<mat-form-field appearance='fill' style='width:100%'>
    <mat-select [disabled]="disabled" [value]="value" (selectionChange)="onChange($event)">
      <ng-content></ng-content>
    </mat-select>
  </mat-form-field>`
})
export class MatSelectComponent {
  @Input() value: any;
  @Input() disabled = false;
  onChange(event: any) {}
}
