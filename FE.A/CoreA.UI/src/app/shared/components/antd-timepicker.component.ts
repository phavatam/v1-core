import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-timepicker',
  standalone: true,
  imports: [NzTimePickerModule, FormsModule],
  template: `<nz-time-picker [(ngModel)]="value" [nzDisabled]="disabled" [nzPlaceHolder]="placeholder" (ngModelChange)="onChange($event)"></nz-time-picker>`
})
export class AntdTimepickerComponent {
  @Input() value: any;
  @Input() disabled = false;
  @Input() placeholder = '';
  @Output() valueChange = new EventEmitter<any>();
  onChange(val: any) { this.valueChange.emit(val); }
}
