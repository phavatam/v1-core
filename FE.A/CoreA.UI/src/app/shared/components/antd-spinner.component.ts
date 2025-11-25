import { Component, Input } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'antd-spinner',
  standalone: true,
  imports: [NzSpinModule],
  template: `<nz-spin [nzSpinning]="spinning" [nzTip]="tip"></nz-spin>`
})
export class AntdSpinnerComponent {
  @Input() spinning = true;
  @Input() tip = '';
}
