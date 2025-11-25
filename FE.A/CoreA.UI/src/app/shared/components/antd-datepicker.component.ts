import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-datepicker',
  standalone: true,
  imports: [NzDatePickerModule, FormsModule],
  template: `<nz-date-picker [(ngModel)]="value" [nzDisabled]="disabled" [nzPlaceHolder]="placeholder" (ngModelChange)="onChange($event)"></nz-date-picker>`
})
export class AntdDatepickerComponent {
  @Input() value: any;
  @Input() disabled = false;
  @Input() placeholder = '';
  @Output() valueChange = new EventEmitter<any>();
  onChange(val: any) { this.valueChange.emit(val); }
}
