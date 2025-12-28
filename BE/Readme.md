dotnet new install Clean.Architecture.Solution.Template::*
dotnet new ca-sln -n TênDựÁnCủaBạn


// Chi tiet
1. ca-sln (Clean Architecture Solution)
Lệnh: dotnet new ca-sln -n TênDựÁn
Tạo ra: Một Solution (.sln) hoàn chỉnh với 4-5 Project (Domain, Application, Infrastructure, Presentation, v.v.). Đây là lệnh bạn dùng để bắt đầu dự án mới.
Ví dụ: Khi bạn muốn bắt đầu dự án "Quản lý Bán hàng" từ đầu.
2. ca-usecase (Clean Architecture Solution Use Case)
Lệnh: dotnet new ca-usecase -n TênTínhNăng --list Product
Tạo ra: Một bộ file code cơ bản cần thiết cho một tính năng nghiệp vụ mới (Use Case) trong các Project Application và Infrastructure đã tồn tại.
Ví dụ: Sau khi tạo dự án bằng ca-sln, bạn muốn thêm tính năng "Tạo Sản phẩm" (CreateProduct). Lệnh này sẽ tự động sinh ra:
CreateProductCommand.cs
CreateProductCommandHandler.cs
CreateProductCommandValidator.cs
Tóm lại:
ca-sln dùng để tạo CƠ SỞ HẠ TẦNG (Solution).
ca-usecase dùng để tạo CÁC TÍNH NĂNG (Feature) bên trong cơ sở hạ tầng đó.