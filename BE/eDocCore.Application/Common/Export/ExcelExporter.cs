using OfficeOpenXml;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using LicenseContext = OfficeOpenXml.LicenseContext;

namespace eDocCore.Application.Common.Export
{
    public static class ExcelExporter
    {
        static ExcelExporter()
        {
            // Thiết lập giấy phép cho EPPlus (bắt buộc từ phiên bản 5 trở đi)
            // ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
            //ExcelPackage.License = new NonCommercialLicense();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        }
        /// <summary>
        /// Xuất dữ liệu từ một danh sách (List) thành một file Excel (.xlsx).
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu của các đối tượng trong danh sách.</typeparam>
        /// <param name="data">Danh sách dữ liệu cần xuất.</param>
        /// <param name="fileName">Tên file Excel sẽ được tạo (ví dụ: "BaoCao.xlsx").</param>
        /// <returns>Mảng byte (byte[]) của file Excel đã tạo.</returns>
        public static byte[] ExportDataToExcel<T>(List<T> data, string sheetName = "Sheet1") where T : class
        {
            // 1. Tạo một gói Excel mới
            using (var package = new ExcelPackage())
            {
                // 2. Thêm một Worksheet
                var worksheet = package.Workbook.Worksheets.Add(sheetName);

                // 3. Tải dữ liệu từ List<T> vào Worksheet
                // Đây là chức năng rất mạnh của EPPlus, tự động tạo Header (tên Property) và Data
                worksheet.Cells["A1"].LoadFromCollection(data, PrintHeaders: false);
                // 2. TẠO VÀ GÁN HEADER TÙY CHỈNH
                SetCustomHeaders(worksheet, typeof(T));
                // 4. (Tùy chọn) Định dạng cột Header
                using (var range = worksheet.Cells[1, 1, 1, worksheet.Dimension.End.Column])
                {
                    range.Style.Font.Bold = true;
                    range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                }

                // 5. (Tùy chọn) Tự động điều chỉnh độ rộng cột
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                // 6. Trả về mảng byte (byte[]) của file Excel
                return package.GetAsByteArray();
            }
        }

        /// <summary>
        /// Xuất nhiều danh sách dữ liệu (List) vào các Sheet khác nhau trong cùng một file Excel.
        /// </summary>
        /// <param name="sheets">Danh sách các đối tượng SheetData, mỗi đối tượng chứa tên Sheet và dữ liệu.</param>
        /// <returns>Mảng byte (byte[]) của file Excel đã tạo.</returns>
        public static byte[] ExportMultipleSheets(List<SheetData> sheets)
        {
            using (var package = new ExcelPackage())
            {
                foreach (var sheetInfo in sheets)
                {
                    // Kiểm tra dữ liệu hợp lệ và không rỗng
                    if (sheetInfo.DataList is not ICollection dataCollection || dataCollection.Count == 0)
                    {
                        Console.WriteLine($"Sheet '{sheetInfo.SheetName}': Dữ liệu rỗng hoặc không phải ICollection. Bỏ qua.");
                        continue;
                    }

                    // 1. Xác định kiểu dữ liệu của đối tượng trong danh sách (T)
                    Type listType = sheetInfo.DataList.GetType();
                    Type itemType = listType.IsGenericType ? listType.GetGenericArguments().FirstOrDefault() : null;

                    if (itemType == null)
                    {
                        Console.WriteLine($"Sheet '{sheetInfo.SheetName}': Không thể xác định kiểu dữ liệu Generic. Bỏ qua.");
                        continue;
                    }

                    // 2. Tìm và tạo (MakeGenericMethod) phương thức LoadFromCollection<T>
                    // Tìm kiếm chính xác overload LoadFromCollection(IEnumerable<T>, bool PrintHeaders)
                    var loadMethod = typeof(ExcelRangeBase)
                        .GetMethods(BindingFlags.Public | BindingFlags.Instance)
                        .Where(m => m.Name == "LoadFromCollection"
                                    && m.IsGenericMethod
                                    && m.GetParameters().Length == 2) // Chính xác 2 tham số: Collection và bool
                        .FirstOrDefault();

                    if (loadMethod == null)
                    {
                        Console.WriteLine($"Sheet '{sheetInfo.SheetName}': Không tìm thấy phương thức LoadFromCollection phù hợp.");
                        continue;
                    }

                    // Tạo phương thức cụ thể: LoadFromCollection<itemType>()
                    MethodInfo genericLoadMethod = loadMethod.MakeGenericMethod(itemType);

                    // 3. Thêm Worksheet và gọi phương thức Load
                    var worksheet = package.Workbook.Worksheets.Add(sheetInfo.SheetName);

                    try
                    {
                        // Gọi phương thức LoadFromCollection<T> sử dụng Reflection
                        // parameters là (dataCollection, PrintHeaders: true)
                        genericLoadMethod.Invoke(
                            worksheet.Cells["A1"],
                            new object[] { dataCollection, true }
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Lỗi khi tải dữ liệu cho sheet '{sheetInfo.SheetName}': {ex.InnerException?.Message ?? ex.Message}");
                        continue;
                    }
                    SetCustomHeaders(worksheet, itemType);

                    // 4. Định dạng Header và Tự động điều chỉnh cột
                    using (var range = worksheet.Cells[1, 1, 1, worksheet.Dimension.End.Column])
                    {
                        range.Style.Font.Bold = true;
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);
                    }

                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                }

                // Kiểm tra nếu không có sheet nào được thêm (tránh trả về file trống)
                if (package.Workbook.Worksheets.Count == 0)
                {
                    throw new InvalidOperationException("Không có dữ liệu hợp lệ để xuất Excel.");
                }

                return package.GetAsByteArray();
            }
        }

        /// <summary>
        /// Hàm tiện ích dùng Reflection để lấy [DisplayName] và đặt vào hàng Header (Row 1).
        /// </summary>
        private static void SetCustomHeaders(ExcelWorksheet worksheet, Type itemType)
        {
            var properties = itemType.GetProperties();
            int col = 1;

            foreach (var prop in properties)
            {
                // Tìm thuộc tính DisplayName
                var displayNameAttr = prop.GetCustomAttribute<DisplayNameAttribute>();

                // Nếu có DisplayName, sử dụng nó; nếu không, dùng tên Property.
                string header = displayNameAttr?.DisplayName ?? prop.Name;

                // Gán giá trị vào dòng 1, cột col
                worksheet.Cells[1, col].Value = header;

                col++;
            }
        }
    }
}
