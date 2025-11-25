import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-rate',
  standalone: true,
  imports: [NzRateModule, FormsModule],
  template: `<nz-rate [(ngModel)]="value" [nzDisabled]="disabled" (ngModelChange)="onChange($event)"></nz-rate>`
})
export class AntdRateComponent {
  @Input() value: number = 0;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<number>();
  onChange(val: number) { this.valueChange.emit(val); }
}
