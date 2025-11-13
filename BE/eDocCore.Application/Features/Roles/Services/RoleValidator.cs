using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using eDocCore.Domain.Interfaces.Extend;

namespace eDocCore.Application.Features.Roles.Services
{
    public class RoleValidator : IRoleValidator
    {
        private readonly IRoleRepository _roleRepository;

        public RoleValidator(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<IReadOnlyList<string>> ValidateCreateAsync(string name, CancellationToken ct = default)
        {
            var errors = new List<string>();
            name = name.Trim();
            if (string.IsNullOrWhiteSpace(name))
            {
                errors.Add("Name is required");
                return errors;
            }

            if (await _roleRepository.ExistsByNameAsync(name))
            {
                errors.Add("Role name already exists");
            }

            return errors;
        }

        public async Task<IReadOnlyList<string>> ValidateUpdateAsync(Guid id, string name, bool isActive, CancellationToken ct = default)
        {
            var errors = new List<string>();
            name = name.Trim();
            if (string.IsNullOrWhiteSpace(name))
            {
                errors.Add("Name is required");
                return errors;
            }

            var (nameTaken, hasUsers) = await _roleRepository.GetUpdateGuardsAsync(id, name, ct);
            if (nameTaken)
            {
                errors.Add("Role name already exists");
            }
            if (!isActive && hasUsers)
            {
                errors.Add("Role is assigned to existing users. Deactivate is not allowed.");
            }

            return errors;
        }
    }
}
