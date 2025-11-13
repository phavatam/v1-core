using eDocCore.Application.Common;
using eDocCore.Application.Common.Models;
using eDocCore.Application.Features.Menus.DTOs;
using eDocCore.Application.Features.Menus.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Net;

namespace eDocCore.API.FeatureTemplate.eDocCore.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _MenuService;
        public MenuController(IMenuService MenuService)
        {
            _MenuService = MenuService;
        }
    }
}