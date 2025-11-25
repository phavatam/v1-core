import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-switch',
  standalone: true,
  imports: [NzSwitchModule, FormsModule],
  template: `<nz-switch [(ngModel)]="checked" [nzDisabled]="disabled" (ngModelChange)="onChange($event)"></nz-switch>`
})
export class AntdSwitchComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  onChange(val: boolean) { this.checkedChange.emit(val); }
}
