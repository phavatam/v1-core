import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Hoặc module cụ thể nếu không muốn là singleton
})
@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  /**
   * Chuyển đổi mã số giới tính (1, 2, 3) thành chuỗi tương ứng.
   * @param value Mã số giới tính (1: Nam, 2: Nữ, 3: Khác)
   * @returns Chuỗi giới tính ('Nam', 'Nữ', 'Khác') hoặc chuỗi lỗi nếu mã không hợp lệ.
   */
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Nam';
      case 2:
        return 'Nữ';
      case 3:
        return 'Khác';
      default:
        // Trả về một chuỗi báo lỗi hoặc một giá trị mặc định nếu số không nằm trong danh sách
        return 'Không xác định'; 
    }
  }

}