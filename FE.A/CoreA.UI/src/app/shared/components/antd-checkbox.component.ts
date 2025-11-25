import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-checkbox',
  standalone: true,
  imports: [NzCheckboxModule, FormsModule],
  template: `<label nz-checkbox [(ngModel)]="checked" (ngModelChange)="onChange($event)">{{label}}</label>`
})
export class AntdCheckboxComponent {
  @Input() checked = false;
  @Input() label = '';
  @Output() checkedChange = new EventEmitter<boolean>();
  onChange(val: boolean) { this.checkedChange.emit(val); }
}
