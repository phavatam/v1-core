// Chạy lệnh generate database
dotnet ef dbcontext scaffold "Server=.;Database=eDocCoreDB;User Id=sa;Password=Matkhau1;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -o ../eDocCore.Domain/Entities --context-dir Persistence --context ApplicationDbContext -f --project eDocCore.Infrastructure --namespace eDocCore.Infrastructure.Persistence
dotnet ef dbcontext scaffold "Server=.;Database=eDocCoreDB;User Id=sa;Password=Matkhau1;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -o ../eDocCore.Domain/Entities --context-dir Persistence --context ApplicationDbContext -f --project eDocCore.Infrastructure --namespace eDocCore.Domain.Entities --context-namespace eDocCore.Infrastructure.Persistence

dotnet user-secrets init
dotnet user-secrets set ConnectionStrings:eDocCoreDB "Server=.;Database=eDocCoreDB;User Id=sa;Password=Matkhau1;TrustServerCertificate=True;"

dotnet ef dbcontext scaffold Name=eDocCoreDB Microsoft.EntityFrameworkCore.SqlServer -o ../eDocCore.Domain/Entities --context-dir Persistence --context ApplicationDbContext -f --project eDocCore.Infrastructure --namespace eDocCore.Domain.Entities --context-namespace eDocCore.Infrastructure.Persistence

.NET Templating Engine.

dotnet new --list
// Auto generate template
dotnet new install ./eDocCore.API/FeatureTemplate
dotnet new uninstall ./eDocCore.API/FeatureTemplate

dotnet new edocfeature -h

dotnet new edocfeature -n TênFeature -o ./ĐườngDẫnTớiThưMụcChứaFeature

dotnet new edocfeature --name {{NameFeature}} --output .

dotnet new edocfeature --name UserTypes --ModelName UserTypes --output .