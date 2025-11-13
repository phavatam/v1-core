using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using eDocCore.API.Controllers;
using eDocCore.Application.Features.Roles.Services;
using eDocCore.Application.Features.Roles.DTOs.Request;
using Castle.Core.Logging;
using Microsoft.Extensions.Logging;
using eDocCore.Application.Features.Roles.DTOs;

namespace eDocCore.Tests.Role
{
    public class RoleControllerUnitTests
    {
        private ILogger<RoleController> _logger;

        [Fact]
        public async Task Create_Should_Return_CreatedAtActionResult()
        {
            // Arrange
            var mockService = new Mock<IRoleService>();
            var controller = new RoleController(mockService.Object, _logger);
            var request = new CreateRoleRequest { Name = "Admin", IsActive = true };
            var created = new RoleDto { Id = Guid.NewGuid(), Name = request.Name, IsActive = request.IsActive };

            mockService.Setup(s => s.CreateAsync(It.IsAny<CreateRoleRequest>())).ReturnsAsync(created);

            // Act
            var result = await controller.Create(request);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(created, createdResult.Value);
            Assert.Equal("GetById", createdResult.ActionName);
        }

        [Fact]
        public async Task Create_Should_Return_500_When_Exception()
        {
            // Arrange
            var mockService = new Mock<IRoleService>();
            var controller = new RoleController(mockService.Object, _logger);
            var request = new CreateRoleRequest { Name = "Admin" };
            mockService.Setup(s => s.CreateAsync(It.IsAny<CreateRoleRequest>())).ThrowsAsync(new Exception("DB error"));

            // Act
            var result = await controller.Create(request);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
            Assert.Contains("DB error", statusResult.Value?.ToString());
        }

        [Fact]
        public async Task Create_Should_Return_400_When_InvalidModelState()
        {
            // Arrange
            var mockService = new Mock<IRoleService>();
            var controller = new RoleController(mockService.Object, _logger);
            controller.ModelState.AddModelError("Name", "Required");
            var request = new CreateRoleRequest { Name = string.Empty };

            // Act
            var result = await controller.Create(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Required", badRequestResult.Value?.ToString());
        }
    }
}
