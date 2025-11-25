import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-slider',
  standalone: true,
  imports: [NzSliderModule, FormsModule],
  template: `<nz-slider [(ngModel)]="value" [nzMin]="min" [nzMax]="max" [nzStep]="step" [nzDisabled]="disabled" (ngModelChange)="onChange($event)"></nz-slider>`
})
export class AntdSliderComponent {
  @Input() value: number | null = null;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step: number = 1;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<number>();
  onChange(val: number) { this.valueChange.emit(val); }
}
