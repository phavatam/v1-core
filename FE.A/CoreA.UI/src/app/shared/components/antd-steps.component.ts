import { Component, Input } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'antd-steps',
  standalone: true,
  imports: [NzStepsModule],
  template: `<nz-steps [nzCurrent]="current"><nz-step *ngFor="let step of steps" [nzTitle]="step"></nz-step></nz-steps>`
})
export class AntdStepsComponent {
  @Input() steps: string[] = [];
  @Input() current = 0;
}
