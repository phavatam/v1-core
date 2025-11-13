using eDocCore.Application.Common;
using eDocCore.Application.Features.Menus.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace eDocCore.API.FeatureTemplate.eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class NavigationController : ControllerBase
    {
        private readonly IMenuService _MenuService;
        public NavigationController(IMenuService MenuService)
        {
            _MenuService = MenuService;
        }

        [HttpGet("get-navigation")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> GetNavigationByToken()
        {
            try
            {
                var navigationAndChild = new List<NavigationAndChild>() { };

                // Thông tin chung
                var commonInfor = new NavigationAndChild()
                {
                    Navigation = new Navigation()
                    {
                        Id = Guid.Parse("53AE39BD-95B7-46D0-B7E9-0EF3A2732443"),
                        MenuName = "Thông tin chung",
                        Sort = 0,
                    },
                    NavigationsChild = new List<NavigationChildOfChildren>()
                    {
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("3D9644E0-C536-4E18-A528-AC19E06F5403"),
                            MenuCode = "MENU_THONG_TIN_CONG_TY",
                            MenuName = "Thông tin đơn vị",
                            Path = "/admin/MENU_THONG_TIN_CONG_TY",
                            IconLink = "ICON_MENU_THONG_TIN_CONG_TY",
                            IdParent = Guid.Parse("53AE39BD-95B7-46D0-B7E9-0EF3A2732443")
                       }
                    }
                };
                navigationAndChild.Add(commonInfor);

                // Quản lý chung
                navigationAndChild.Add(
                    new NavigationAndChild()
                    {
                        Navigation = new Navigation()
                        {
                            Id = Guid.Parse("E401D7D7-063C-4B9C-B9AF-E0870800CF72"),
                            MenuName = "Quản lý chung",
                            Sort = 1,
                        },
                        NavigationsChild = new List<NavigationChildOfChildren>()
                        {
                           new NavigationChildOfChildren ()
                           {
                                Id = Guid.Parse("E62418A5-6C84-4816-A83F-549161996C5F"),
                                MenuName = "Đơn vị phòng ban",
                                IdParent = Guid.Parse("E401D7D7-063C-4B9C-B9AF-E0870800CF72"),
                                Path = "/admin/MENU_DON_VI_PHONG_BAN",
                                IconLink = "ICON_MENU_DON_VI_PHONG_BAN",
                                MenuCode = "MENU_DON_VI_PHONG_BAN"
                           },
                           new NavigationChildOfChildren ()
                           {
                                Id = Guid.Parse("6300BB37-93B1-4FB4-A324-7770FA24204F"),
                                MenuName = "Loại người dùng",
                                IdParent = Guid.Parse("E401D7D7-063C-4B9C-B9AF-E0870800CF72"),
                                Path = "/admin/MENU_LOAI_NGUOI_DUNG",
                                IconLink = "ICON_MENU_LOAI_NGUOI_DUNG",
                                MenuCode = "MENU_LOAI_NGUOI_DUNG"
                           },
                           new NavigationChildOfChildren ()
                           {
                                Id = Guid.Parse("7F709570-C6D0-493A-8181-97D9F960C97B"),
                                MenuCode = "MENU_NGUOI_DUNG",
                                MenuName = "Người dùng",
                                IdParent = Guid.Parse("E401D7D7-063C-4B9C-B9AF-E0870800CF72"),
                                Path = "/admin/MENU_NGUOI_DUNG",
                                IconLink = "ICON_MENU_NGUOI_DUNG",
                           },
                           new NavigationChildOfChildren ()
                           {
                                Id = Guid.Parse("6E0FD8F9-7BDC-423B-AE7F-CB06E4D4F1C7"),
                                MenuCode = "MENU_QUYEN_NGUOI_DUNG",
                                MenuName = "Quyền người dùng",
                                Path = "/admin/MENU_QUYEN_NGUOI_DUNG",
                                IconLink = "ICON_MENU_QUYEN_NGUOI_DUNG",
                                IdParent = Guid.Parse("E401D7D7-063C-4B9C-B9AF-E0870800CF72")
                           },
                        }
                    });


                // Quản trị danh mục
                var manageCategory = new NavigationAndChild()
                {
                    Navigation = new Navigation()
                    {
                        Id = Guid.Parse("2B2F9BAA-D56E-493A-9CD6-674335C73D29"),
                        MenuName = "Quản trị danh mục",
                        Sort = 2,
                    },
                    NavigationsChild = new List<NavigationChildOfChildren>()
                    {
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("E44A6EC3-EAA5-4758-898D-423D34D97BF7"),
                            MenuName = "Danh mục tiêu chí đánh giá",
                            IdParent = Guid.Parse("2B2F9BAA-D56E-493A-9CD6-674335C73D29"),
                            MenuCode = "MENU_TAO_PHIEU_THUC_TAP",
                            Path = "/admin/DANH_MUC_TIEU_CHI_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("792AF726-13B2-475A-97CD-5B2AE0844BB4"),
                            MenuName = "Danh mục phân loại đánh giá",
                            IdParent = Guid.Parse("2B2F9BAA-D56E-493A-9CD6-674335C73D29"),
                            MenuCode = "DANH_MUC_PHAN_LOAI_DANH_GIA",
                            Path = "/admin/DANH_MUC_PHAN_LOAI_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("4DE19065-F761-46FF-BF06-9DCE7B866ED5"),
                            MenuName = "Danh mục nhận xét đánh giá",
                            IdParent = Guid.Parse("2B2F9BAA-D56E-493A-9CD6-674335C73D29"),
                            MenuCode = "MENU_TAO_PHIEU_THUC_TAP",
                            Path = "/admin/DANH_MUC_NHAN_XET_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("019A2A3B-0472-4AD6-9D4E-C00A992EFF84"),
                            MenuName = "Danh mục loại thời gian",
                            IdParent = Guid.Parse("2B2F9BAA-D56E-493A-9CD6-674335C73D29"),
                            MenuCode = "DANH_MUC_LOAI_THOI_GIAN",
                            Path = "/admin/DANH_MUC_LOAI_THOI_GIAN",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("019A2A3B-0472-4AD6-9D4E-C00A992EFF99"),
                            MenuName = "Danh mục xếp loại",
                            IdParent = Guid.Parse("2B2F9BAA-D56E-493A-9CD6-674335C73D29"),
                            MenuCode = "DANH_MUC_XEP_LOAI",
                            Path = "/admin/DANH_MUC_XEP_LOAI",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("30F04AE0-200F-48FC-8861-F3C5784D5C3D"),
                            MenuName = "Danh mục ưu và nhược điểm đánh giá",
                            IdParent = Guid.Parse("2B2F9BAA-D56E-493A-9CD6-674335C73D29"),
                            MenuCode = "DANH_MUC_UU_NHUOC_DIEM_DANH_GIA",
                            Path = "/admin/DANH_MUC_UU_NHUOC_DIEM_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       }
                    }
                };
                //navigationAndChild.Add(manageCategory);

                // Quản trị đánh giá
                var manageEvalute = new NavigationAndChild()
                {
                    Navigation = new Navigation()
                    {
                        Id = Guid.Parse("0BB67E97-4585-4133-B7A1-D4E4978CDDD1"),
                        MenuName = "",
                        Sort = 8,
                    },
                    NavigationsChild = new List<NavigationChildOfChildren>()
                    {
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("BC7F4EA2-A400-4806-972C-25F093DFA681"),
                            MenuName = "Cấp phê duyệt",
                            IdParent = Guid.Parse("0AB67E97-4585-4133-B7A1-D4E4978CDDD1"),
                            Path = "/admin/QUAN_LY_CAP_PHE_DUYET",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP",
                            MenuCode = "QUAN_LY_CAP_PHE_DUYET"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("BC7F4EA2-A400-4806-972C-25F093DFA682"),
                            MenuName = "Thống kê đánh giá",
                            IdParent = Guid.Parse("0AB67E97-4585-4133-B7A1-D4E4978CDDD1"),
                            Path = "/admin/QUAN_LY_THONG_KE_DANH_GIA",
                            MenuCode = "QUAN_LY_THONG_KE_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("5DA3D6B4-4508-4DAB-B850-68FBBF8C7F8A"),
                            MenuName = "Thống kê tổng hợp và chuyển",
                            IdParent = Guid.Parse("0AB67E97-4585-4133-B7A1-D4E4978CDDD1"),
                            Path = "/admin/THONG_KE_TONG_HOP_VA_CHUYEN",
                            MenuCode = "THONG_KE_TONG_HOP_VA_CHUYEN",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("B7643974-3468-4C5F-82FC-795D876D9A9E"),
                            MenuName = "Quản lý phiếu đánh giá",
                            IdParent = Guid.Parse("0AB67E97-4585-4133-B7A1-D4E4978CDDD1"),
                            Path = "/admin/QUAN_LY_PHIEU_DANH_GIA",
                            MenuCode = "QUAN_LY_PHIEU_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("7A9FEF3E-4821-43CE-8533-FBF601BF061A"),
                            MenuName = "Tổng hợp và chuyển",
                            IdParent = Guid.Parse("0AB67E97-4585-4133-B7A1-D4E4978CDDD1"),
                            Path = "/admin/TONG_HOP_VA_CHUYEN",
                            MenuCode = "TONG_HOP_VA_CHUYEN",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       }
                    }
                };
                //navigationAndChild.Add(manageEvalute);

                // Phiếu đánh giá
                var manageItemEvalute = new NavigationAndChild()
                {
                    Navigation = new Navigation()
                    {
                        Id = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF"),
                        MenuName = "Phiếu đánh giá",
                        Sort = 4
                    },
                    NavigationsChild = new List<NavigationChildOfChildren>()
                    {   
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("E7625668-DBA8-4422-8325-26D674025415"),
                            MenuCode = "LICH_SU_PHIEU_DANH_GIA",
                            MenuName = "Lịch sử phiếu đánh giá",
                            Path = "/admin/LICH_SU_PHIEU_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("EDB5F597-4E3C-4592-9057-B1A926533D41"),
                            MenuCode = "TU_DANH_GIA_TOAN_BO",
                            MenuName = "Danh sách tự đánh giá toàn bộ",
                            Path = "/admin/TU_DANH_GIA_TOAN_BO",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("5D0C674D-AAB9-4C76-B072-B1C3982F548D"),
                            MenuCode = "/DANH_SACH_CHO_DANH_GIA",
                            MenuName = "Danh sách chờ đánh giá",
                            Path = "/admin/DANH_SACH_CHO_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       }
                    }
                };
                //navigationAndChild.Add(manageItemEvalute);

                // Quản lý chữ ký số
                var manageSignOff = new NavigationAndChild()
                {
                    Navigation = new Navigation()
                    {
                        Id = Guid.NewGuid(),
                        MenuName = "Quản lý chữ ký số",
                        Sort = 5
                    },
                    NavigationsChild = new List<NavigationChildOfChildren>()
                    {
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.NewGuid(),
                            MenuCode = "DANH_SACH_CHU_KY_SO",
                            MenuName = "Danh sách chữ kí số",
                            Path = "/admin/DANH_SACH_CHU_KY_SO",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP",
                            IdParent = Guid.Parse("F696677C-01B1-4C14-9DC6-316C78C1F5E3")
                       }
                    }
                };
                //navigationAndChild.Add(manageSignOff);

                var compensationAndBenefit = new NavigationAndChild()
                {
                    Navigation = new Navigation()
                    {
                        Id = Guid.NewGuid(),
                        MenuName = "Phúc lợi nhân viên",
                        Sort = 9
                    },
                    NavigationsChild = new List<NavigationChildOfChildren>()
                    {
                        new NavigationChildOfChildren ()
                       {
                            Id = Guid.Parse("E44A6EC3-EAA5-4758-898D-423D34D97BF7"),
                            MenuName = "Danh mục tiêu chí đánh giá",
                            IdParent = Guid.Parse("2B2F9BAA-D56E-493A-9CD6-674335C73D29"),
                            MenuCode = "MENU_TAO_PHIEU_THUC_TAP",
                            Path = "/admin/DANH_MUC_TIEU_CHI_DANH_GIA",
                            IconLink = "ICON_MENU_TAO_PHIEU_THUC_TAP"
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.NewGuid(),
                            MenuCode = "resignation-application",
                            MenuName = "Phiếu đăng ký nghỉ việc",
                            Path = "/admin/resignation-application",
                            IconLink = "ICON_RESIGNATION_APPLICATION",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.NewGuid(),
                            MenuCode = "leave-application",
                            MenuName = "Quản lý phép",
                            Path = "/admin/leave-application",
                            IconLink = "ICON_LEAVE_APPLICATION",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.NewGuid(),
                            MenuCode = "missing-timeclock-application",
                            MenuName = "Bổ sung dữ liệu quẹt thẻ",
                            Path = "admin/missing-timeclock-application",
                            IconLink = "ICON_MISSING_TIMECLOCK_APPLICATION",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.NewGuid(),
                            MenuCode = "overtime-application",
                            MenuName = "Đăng ký tăng ca",
                            Path = "admin/overtime-application",
                            IconLink = "ICON_OVERTIME_APPLICATION",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       },
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.NewGuid(),
                            MenuCode = "shift-exchange-application",
                            MenuName = "Đăng ký chuyển ca",
                            Path = "admin/shift-exchange-application",
                            IconLink = "ICON_SHIFTEXCHANGE_APPLICATION",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       }
                    }
                };
                navigationAndChild.Add(compensationAndBenefit);

                var systemManage = new NavigationAndChild()
                {
                    Navigation = new Navigation()
                    {
                        Id = Guid.NewGuid(),
                        MenuName = "Quản trị viên",
                        Sort = 10
                    },
                    NavigationsChild = new List<NavigationChildOfChildren>()
                    {
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.NewGuid(),
                            MenuCode = "system-application",
                            MenuName = "Trang thiết bị",
                            Path = "admin/resignation-application",
                            IconLink = "ICON_SYSTEM_APPLICATION",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       }
                    }
                };
                navigationAndChild.Add(systemManage);

                var academy = new NavigationAndChild()
                {
                    Navigation = new Navigation()
                    {
                        Id = Guid.NewGuid(),
                        MenuName = "Academy",
                        Sort = 10
                    },
                    NavigationsChild = new List<NavigationChildOfChildren>()
                    {
                       new NavigationChildOfChildren ()
                       {
                            Id = Guid.NewGuid(),
                            MenuCode = "academy-application",
                            MenuName = "Yêu cầu khóa học",
                            Path = "admin/academy-application",
                            IconLink = "ICON_ACADEMY_APPLICATION",
                            IdParent = Guid.Parse("B4AD1891-9E56-405F-88D0-92EDDBD356DF")
                       }
                    }
                };
                navigationAndChild.Add(academy);

                return Ok(ResultDTO<object>.Success(navigationAndChild));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResultDTO.Failure((int)HttpStatusCode.InternalServerError, ex.Message, HttpContext.TraceIdentifier));
            }
        }
    }

    public class Navigation
    {
        public Guid Id { get; set; }
        public string MenuName { get; set; } = string.Empty;
        public Guid? IdParent { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? Path { get; set; }
        public string? IconLink { get; set; }
        public string? MenuCode { get; set; }
        public int? Sort { get; set; }
        public bool IsHide { get; set; }
    }


    public class NavigationAndChild
    {
        public Navigation? Navigation { get; set; }
        public List<NavigationChildOfChildren>? NavigationsChild { get; set; }
    }

    public class NavigationChildOfChildren
    {
        public Guid Id { get; set; }
        public string MenuName { get; set; } = string.Empty;
        public Guid? IdParent { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? Path { get; set; }
        public string? IconLink { get; set; }
        public string? MenuCode { get; set; }
        public int? Sort { get; set; }
        public List<NavigationChildOfChildren>? NavigationsChildOfChild { get; set; }
    }
}
