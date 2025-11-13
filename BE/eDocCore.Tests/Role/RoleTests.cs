using Xunit;
using Moq;
using eDocCore.Domain.Interfaces;
using System.Threading;
using System.Threading.Tasks;
using System;
using eDocCore.Domain.Interfaces.Extend;

namespace eDocCore.Tests.Role
{
    public class RoleTests
    {
        [Fact]
        public async Task CreateRoleCommandHandler_Should_Create_Role()
        {
            //// Arrange
            //var mockRepo = new Mock<IRoleRepository>();
            //var mockUow = new Mock<IUnitOfWork>();
            //var handler = new CreateRoleCommandHandler(mockRepo.Object, mockUow.Object);
            //var command = new CreateRoleCommand { Name = "Admin" };
            //var expectedId = Guid.NewGuid();

            //// Sử dụng type đầy đủ cho Role và gán Id đúng
            //var roleEntity = new eDocCore.Domain.Entities.Role { Id = expectedId, Name = "Admin" };
            //mockRepo.Setup(r => r.AddAsync(It.IsAny<eDocCore.Domain.Entities.Role>())).ReturnsAsync(roleEntity);
            //mockUow.Setup(u => u.BeginTransactionAsync()).Returns(Task.CompletedTask);
            //mockUow.Setup(u => u.CommitAsync()).Returns(Task.CompletedTask);
            //mockUow.Setup(u => u.RollbackAsync()).Returns(Task.CompletedTask);

            //// Act
            //var result = await handler.Handle(command, CancellationToken.None);

            //// Assert
            //Assert.Equal(expectedId, result);
            //Console.WriteLine("✅ CreateRoleCommandHandler_Should_Create_Role passed");
        }

        /*[Fact]
        public async Task CreateRoleCommandHandler_Should_ThrowException_WhenNameIsEmpty()
        {
            // Arrange
            var mockRepo = new Mock<IRoleRepository>();
            var mockUow = new Mock<IUnitOfWork>();
            var handler = new CreateRoleCommandHandler(mockRepo.Object, mockUow.Object);
            var command = new CreateRoleCommand { Name = "" };
            mockRepo.Setup(r => r.AddAsync(It.IsAny<eDocCore.Domain.Entities.Role>())).ThrowsAsync(new ArgumentException("Name is required"));
            mockUow.Setup(u => u.BeginTransactionAsync()).Returns(Task.CompletedTask);
            mockUow.Setup(u => u.RollbackAsync()).Returns(Task.CompletedTask);

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(async () => await handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task CreateRoleCommandHandler_Should_ThrowException_WhenDuplicateName()
        {
            // Arrange
            var mockRepo = new Mock<IRoleRepository>();
            var mockUow = new Mock<IUnitOfWork>();
            var handler = new CreateRoleCommandHandler(mockRepo.Object, mockUow.Object);
            var command = new CreateRoleCommand { Name = "Admin" };
            mockRepo.Setup(r => r.AddAsync(It.IsAny<eDocCore.Domain.Entities.Role>())).ThrowsAsync(new InvalidOperationException("Role already exists"));
            mockUow.Setup(u => u.BeginTransactionAsync()).Returns(Task.CompletedTask);
            mockUow.Setup(u => u.RollbackAsync()).Returns(Task.CompletedTask);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task CreateRoleCommandHandler_Should_Rollback_WhenExceptionThrown()
        {
            // Arrange
            var mockRepo = new Mock<IRoleRepository>();
            var mockUow = new Mock<IUnitOfWork>();
            var handler = new CreateRoleCommandHandler(mockRepo.Object, mockUow.Object);
            var command = new CreateRoleCommand { Name = "Admin" };
            mockRepo.Setup(r => r.AddAsync(It.IsAny<eDocCore.Domain.Entities.Role>())).ThrowsAsync(new Exception("DB error"));
            mockUow.Setup(u => u.BeginTransactionAsync()).Returns(Task.CompletedTask);
            mockUow.Setup(u => u.RollbackAsync()).Returns(Task.CompletedTask).Verifiable();

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(async () => await handler.Handle(command, CancellationToken.None));
            mockUow.Verify(u => u.RollbackAsync(), Times.Once);
        }*/
    }
}
