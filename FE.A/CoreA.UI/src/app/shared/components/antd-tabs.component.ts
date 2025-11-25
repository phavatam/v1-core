import { Component, Input } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'antd-tabs',
  standalone: true,
  imports: [NzTabsModule],
  template: `<nz-tabs><nz-tab *ngFor="let tab of tabs" [nzTitle]="tab.title">{{tab.content}}</nz-tab></nz-tabs>`
})
export class AntdTabsComponent {
  @Input() tabs: Array<{ title: string; content: string }> = [];
}
