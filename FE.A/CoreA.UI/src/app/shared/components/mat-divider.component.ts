import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'mat-divider',
  standalone: true,
  imports: [MatDividerModule],
  template: `<mat-divider></mat-divider>`
})
export class MatDividerComponent {}
