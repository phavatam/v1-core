using AutoMapper;
using eDocCore.Application.Features.ResignationApplications.DTOs;
using eDocCore.Application.Features.ResignationApplications.DTOs.Request;
using eDocCore.Application.Features.Auth.DTOs;
using eDocCore.Application.Features.Auth.DTOs.Request;
using eDocCore.Domain.Entities;

namespace eDocCore.Application.Features.ResignationApplications.Mapping
{
    public class ResignationApplicationMappingProfile : Profile
    {
        public ResignationApplicationMappingProfile()
        {
            CreateMap<ResignationApplication, ResignationApplicationDto>().ReverseMap();
            CreateMap<CreateResignationApplicationRequest, ResignationApplication>().ReverseMap();
            CreateMap<UpdateResignationApplicationRequest, ResignationApplication>().ReverseMap();
        }
    }
}