
import { Component } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NzSpinModule, CommonModule],
  template: `
    <div class="global-loading">
      <nz-spin nzTip="Loading..." [nzSpinning]="true"></nz-spin>
    </div>
  `,
  styles: [`
    .global-loading {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.4);
      z-index: 9999;
    }
  `]
})
export class LoadingComponent {}
