import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'mat-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  template: `<mat-paginator [length]="length" [pageSize]="pageSize" [pageSizeOptions]="pageSizeOptions" (page)="page.emit($event)"></mat-paginator>`
})
export class MatPaginatorComponent {
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Output() page = new EventEmitter<any>();
}
