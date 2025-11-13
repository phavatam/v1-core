using MediatR;
using System.Collections.Generic;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Features.Users.Queries
{
    public class GetUsersQuery : IRequest<List<User>>
    {
    }
}
