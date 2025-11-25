import { Component, Input } from '@angular/core';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'antd-input-number',
  standalone: true,
  imports: [NzInputNumberModule, FormsModule, CommonModule],
  template: `<nz-input-number [(ngModel)]="value" [nzMin]="min" [nzMax]="max" [nzStep]="step" [nzDisabled]="disabled" style="width:100%;" />`
})
export class AntdInputNumberComponent {
  @Input() value: number | null = null;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step: number = 1;
  @Input() disabled = false;
}
