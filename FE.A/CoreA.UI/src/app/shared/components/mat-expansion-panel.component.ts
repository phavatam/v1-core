import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'mat-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule],
  template: `<mat-expansion-panel><ng-content></ng-content></mat-expansion-panel>`
})
export class MatExpansionPanelComponent {}
