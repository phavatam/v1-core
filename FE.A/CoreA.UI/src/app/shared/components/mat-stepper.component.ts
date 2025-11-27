import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'mat-stepper',
  standalone: true,
  imports: [MatStepperModule],
  template: `<mat-horizontal-stepper><ng-content></ng-content></mat-horizontal-stepper>`
})
export class MatStepperComponent {}
