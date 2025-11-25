
import { Component, Input } from '@angular/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'antd-tooltip',
  standalone: true,
  imports: [NzToolTipModule, CommonModule],
  template: `<span nz-tooltip><ng-content></ng-content></span>`
})
export class AntdTooltipComponent {}
