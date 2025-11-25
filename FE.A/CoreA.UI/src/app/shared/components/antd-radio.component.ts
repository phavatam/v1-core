import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-radio',
  standalone: true,
  imports: [NzRadioModule, FormsModule],
  template: `<label nz-radio [(ngModel)]="checked" (ngModelChange)="onChange($event)">{{label}}</label>`
})
export class AntdRadioComponent {
  @Input() checked = false;
  @Input() label = '';
  @Output() checkedChange = new EventEmitter<boolean>();
  onChange(val: boolean) { this.checkedChange.emit(val); }
}
