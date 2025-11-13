using eDocCore.Domain.Interfaces;
using eDocCore.Domain.Interfaces.Extend;

namespace eDocCore.Tests.Role
{
    internal class CreateRoleCommandHandler
    {
        private IRoleRepository object1;
        private IUnitOfWork object2;

        public CreateRoleCommandHandler(IRoleRepository object1, IUnitOfWork object2)
        {
            this.object1 = object1;
            this.object2 = object2;
        }
    }
}