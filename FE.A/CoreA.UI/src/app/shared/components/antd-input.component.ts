import { Component, Input, forwardRef } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'antd-input',
  standalone: true,
  imports: [NzInputModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AntdInputComponent),
      multi: true
    }
  ],
  template: `
    <div style="position:relative; width:100%;">
      <input nz-input [type]="showPassword ? 'text' : type" [placeholder]="placeholder" [disabled]="disabled" [value]="value" (input)="onInput($event)" style="width:100%; padding-right:2.5rem;" />
      <button *ngIf="type === 'password'" type="button" (click)="togglePassword()" style="position:absolute; right:0.5rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer;">
        <span [ngStyle]="{color: '#888', fontSize: '1.2rem'}">{{ showPassword ? '🙈' : '👁️' }}</span>
      </button>
    </div>
  `
})
export class AntdInputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled = false;
  value: string = '';
  showPassword = false;

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

  togglePassword() { this.showPassword = !this.showPassword; }
}
