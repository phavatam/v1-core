import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'mat-table',
  standalone: true,
  imports: [MatTableModule],
  template: `
    <table mat-table [dataSource]="data">
      <ng-content></ng-content>
    </table>
  `
})
export class MatTableComponent {
  @Input() data: any[] = [];
}
