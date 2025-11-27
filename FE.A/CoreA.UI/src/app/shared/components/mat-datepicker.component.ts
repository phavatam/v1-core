import { Component, Input } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mat-datepicker',
  standalone: true,
  imports: [MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `<mat-form-field appearance='fill' style='width:100%'>
    <input matInput [matDatepicker]="picker" [(ngModel)]="value" [placeholder]="placeholder" [disabled]="disabled">
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>`
})
export class MatDatepickerComponent {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() value: Date | null = null;
}
