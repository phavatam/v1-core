import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-select',
  standalone: true,
  imports: [NzSelectModule, FormsModule],
  template: `
    <nz-select
      [(ngModel)]="value"
      [nzMode]="mode"
      [nzPlaceHolder]="placeholder"
      [nzOptions]="options"
      [nzDisabled]="disabled"
      (ngModelChange)="onChange($event)"
      style="width:100%;"
    ></nz-select>
  `
})
export class AntdSelectComponent {
  @Input() value: any;
  @Input() options: Array<{ label: string; value: any }> = [];
  @Input() placeholder: string = '';
  @Input() disabled = false;
  @Input() mode: 'default' | 'multiple' = 'default';
  @Output() valueChange = new EventEmitter<any>();

  onChange(val: any) {
    this.valueChange.emit(val);
  }
}
