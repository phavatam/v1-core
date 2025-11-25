import { Component, Input } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'antd-breadcrumb',
  standalone: true,
  imports: [NzBreadCrumbModule, CommonModule],
  template: `<nz-breadcrumb><nz-breadcrumb-item *ngFor="let item of items">{{item}}</nz-breadcrumb-item></nz-breadcrumb>`
})
export class AntdBreadcrumbComponent {
  @Input() items: string[] = [];
}
