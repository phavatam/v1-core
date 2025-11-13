using AutoMapper;
using eDocCore.Application.Features.Users.Commands;
using eDocCore.Application.Features.Users.DTOs;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Features.Users.Mapping
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        { 
            // Commands -> Domain (repo/EF sẽ xử lý audit/Id)
            CreateMap<CreateUserCommand, User>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.Created, opt => opt.Ignore())
                .ForMember(d => d.Modified, opt => opt.Ignore());

            CreateMap<UpdateUserCommand, User>()
                .ForMember(d => d.Created, opt => opt.Ignore())
                .ForMember(d => d.Modified, opt => opt.Ignore());

            CreateMap<User, UserDTO>().ReverseMap();
        }
    }
}
