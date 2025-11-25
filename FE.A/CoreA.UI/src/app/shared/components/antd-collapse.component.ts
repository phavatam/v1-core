import { Component, Input } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'antd-collapse',
  standalone: true,
  imports: [NzCollapseModule],
  template: `<nz-collapse><nz-collapse-panel *ngFor="let panel of panels" [nzHeader]="panel.header">{{panel.content}}</nz-collapse-panel></nz-collapse>`
})
export class AntdCollapseComponent {
  @Input() panels: Array<{ header: string; content: string }> = [];
}
