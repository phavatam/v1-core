import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'antd-upload',
  standalone: true,
  imports: [NzUploadModule],
  template: `<nz-upload [nzFileList]="fileList" [nzMultiple]="multiple" [nzShowUploadList]="showList" [nzDisabled]="disabled" (nzChange)="onChange($event)"></nz-upload>`
})
export class AntdUploadComponent {
  @Input() fileList: any[] = [];
  @Input() multiple = false;
  @Input() showList = true;
  @Input() disabled = false;
  @Output() fileListChange = new EventEmitter<any[]>();
  onChange(event: any) { this.fileListChange.emit(event.fileList); }
}
