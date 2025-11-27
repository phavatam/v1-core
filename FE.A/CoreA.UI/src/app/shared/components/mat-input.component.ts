import { Component, Input, forwardRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 * MatInputComponent - input control sử dụng Angular Material, hỗ trợ ControlValueAccessor
 * Sử dụng:
 * <mat-input [(ngModel)]="value" placeholder="Nhập thông tin" type="text"></mat-input>
 */
@Component({
  selector: 'mat-input',
  standalone: true,
  imports: [MatInputModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatInputComponent),
      multi: true
    }
  ],
  template: `
    <mat-form-field appearance="fill" style="width:100%;">
      <input matInput
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        autocomplete="off"
      />
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatInputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  value: string = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: any): void {
    this.value = val ?? '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}
