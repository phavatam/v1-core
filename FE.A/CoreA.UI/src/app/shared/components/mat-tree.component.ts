import { Component, Input } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';

@Component({
  selector: 'mat-tree',
  standalone: true,
  imports: [MatTreeModule],
  template: `<mat-tree [dataSource]="dataSource" [treeControl]="treeControl"><ng-content></ng-content></mat-tree>`
})
export class MatTreeComponent {
  @Input() dataSource: any;
  @Input() treeControl: any;
}
