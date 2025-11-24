import { CategoryAssessmentType } from "@admin/features/categoryAssessmentType";
import { CategoryReview } from "@admin/features/categoryReview";
import { CategoryTimeType } from "@admin/features/categoryTimeType";
import { CategorySourcePlanning } from "@admin/features/categorySourcePlanning";
import { CategoryObjectGroup } from "@admin/features/categoryObjectGroup";
import { CategoryStatus } from "@admin/features/categoryStatus";
import { CategoryJobStatus } from "@admin/features/categoryJobStatus";
import { TypeAssessment } from "@admin/features/typeAssessment";
import { CategoryCriteria } from "@admin/features/categoryCriteria";
import { Evaluations, EvaluationsOfSupervisor, EvaluationsOfUser } from "@admin/features/evaluations";
import { EvaluationsSupervisor } from "@admin/features/EvaluationsSupervisor";
import { ElectronicSignature } from "@admin/features/electronicSignature";
import { CategoryGrading } from "@admin/features/CategoryGrading";
import { EvaluationStatistics } from "@admin/features/EvaluationStatistics";
import { ReviewHistory } from "@admin/features/reviewHistory";
import {
  ConsolidationAndTransfer,
  AnalystConsolidationAndTransfer
} from "~/package/admin/features/consolidationAndTransfer";
import { UserManage } from "./list-componets-lazy-admin";
import {
  CategorySalaryLevel,
  CategoryEducationalDegree,
  CategorySalaryScale,
  CategoryTypeSalaryScale,
  CategoryGovernmentManagement,
  CategoryProfessionalQualification,
  CategoryPolicyBeneficiary,
  CategoryNationality,
  CurriculumVitae,
  Allowance,
  CategoryCompensationBenefits,
  CategoryLaborEquipment,
  CategoryVacancies,
  CreateRequestToHired,
  CreateTicketLaborEquipment,
  Employee,
  EmployeeDayOff,
  EmployeeType,
  RequestToHiredDepartment,
  RequestToHiredHistory,
  Role,
  TicketLaborEquipment,
  TicketLaborEquipmentHistory,
  Unit,
  UserType,
  WorkflowTemplate,
  CreateInternRequest,
  InternRequest,
  InternRequestHistory,
  CreateOnLeave,
  OnLeave,
  OnLeaveHistory,
  CreateOvertime,
  Overtime,
  OvertimeHistory,
  CreateResign,
  Resign,
  ResignHistory,
  BusinessTrip,
  BusinessTripHistory,
  CreateBusinessTrip,
  CreatePromotionTransfer,
  PromotionTransfer,
  PromotionTransferHistory,
  CategoryPosition,
  CategoryNews,
  CompanyInformation,
  Candidate,
  News,
  ManageOverTime,
  ManageInternRequest,
  ManageOnLeave,
  ManageResign,
  ManageTicketLaborEquipment,
  ManageCalculateWorkingDays,
  ManagePromotionTransfer,
  ManageRequestToHired,
  ManageBusinessTrip,
  ManageResignation,
  CreateResignation
} from "./list-component-lazy";

// src/package/admin/adminRoutes.tsx
import { Route } from "react-router-dom";

// #region Khai báo route
export const DefineRoutes = [
  <Route path="/admin/resignation-application/new" element={<CreateResignation />} key="new" />,
  <Route path="/admin/resignation-application/:id" element={<CreateResignation />} key="edit" />
];
// #endregion

/* Phần này dành cho làm động nav */
export const RouteMapData = {
  //admin
  MENU_DON_VI_PHONG_BAN: <Unit />,
  QUAN_LY_THONG_KE_DANH_GIA: <EvaluationStatistics />,
  MENU_LOAI_NGUOI_DUNG: <UserType />,
  MENU_NGUOI_DUNG: <UserManage />,
  MENU_DANH_MUC_PHU_CAP: <Allowance />,
  MENU_QUYEN_NGUOI_DUNG: <Role />,
  MENU_QUY_TRINH: <WorkflowTemplate />,
  //employee
  MENU_SOYEULILICHNHANVIEN: <CurriculumVitae />,

  DANHMUC_QUOCTICH: <CategoryNationality />,
  DANHMUC_DOITUONGCHINHSACH: <CategoryPolicyBeneficiary />,
  DANHMUC_TRINHDOCHUYENMON: <CategoryProfessionalQualification />,
  DANHMUC_QUANLYNHANUOC: <CategoryGovernmentManagement />,
  DANHMUC_LOAINGACHLUONG: <CategoryTypeSalaryScale />,
  DANHMUC_NGACHLUONG: <CategorySalaryScale />,
  DANHMUC_BANGCAP: <CategoryEducationalDegree />,
  DANHMUC_BACLUONG: <CategorySalaryLevel />,

  DANH_MUC_NHAN_XET_DANH_GIA: <CategoryReview />,
  DANH_MUC_UU_NHUOC_DIEM_DANH_GIA: <CategoryAssessmentType />,
  DANH_MUC_XEP_LOAI: <CategoryGrading />,
  DANH_MUC_NHOM_DOI_TUONG: <CategoryObjectGroup />,
  DANH_MUC_TRANG_THAI: <CategoryStatus />,
  DANH_MUC_LOAI_THOI_GIAN: <CategoryTimeType />,
  DANH_MUC_NGUON_KE_HOACH: <CategorySourcePlanning />,
  DANH_MUC_TRANG_THAI_CONG_VIEC: <CategoryJobStatus />,
  DANH_MUC_PHAN_LOAI_DANH_GIA: <TypeAssessment />,
  QUAN_LY_PHIEU_DANH_GIA: <Evaluations />,
  TU_DANH_GIA_TOAN_BO: <EvaluationsOfUser />,
  DANH_SACH_CHO_DANH_GIA: <EvaluationsOfSupervisor />,
  LICH_SU_PHIEU_DANH_GIA: <ReviewHistory />,
  QUAN_LY_CAP_PHE_DUYET: <EvaluationsSupervisor />,
  DANH_SACH_CHU_KY_SO: <ElectronicSignature />,
  TONG_HOP_VA_CHUYEN: <ConsolidationAndTransfer />,
  THONG_KE_TONG_HOP_VA_CHUYEN: <AnalystConsolidationAndTransfer />,

  MENU_DANH_MUC_BOI_THUONG_VA_PHUC_LOI: <CategoryCompensationBenefits />,
  MENU_BOI_THUONG_VA_PHUC_LOI_NHAN_VIEN: <EmployeeDayOff />,
  MENU_NGAY_NGHI_NHAN_VIEN: <EmployeeDayOff />,
  MENU_LOAI_NHAN_VIEN: <EmployeeType />,
  MENU_QUAN_LY_NHAN_VIEN: <Employee />,
  //request to hired
  MENU_VI_TRI_UNG_TUYEN: <CategoryVacancies />,
  MENU_YEU_CAU_TUYEN_DUNG: <RequestToHiredDepartment />,
  MENU_LICH_SU_YEU_CAU_TUYEN_DUNG: <RequestToHiredHistory />,
  MENU_TAO_PHIEU_YEU_CAU_TUYEN_DUNG: <CreateRequestToHired />,
  MENU_QUAN_LY_TUYEN_DUNG: <ManageRequestToHired />,
  //ticket labor equipment
  MENU_DANH_MUC_TRANG_THIET_BI_LAO_DONG: <CategoryLaborEquipment />,
  MENU_PHIEU_YEU_CAU_TRANG_THIET_BI_LAO_DONG: <TicketLaborEquipment />,
  MENU_TAO_PHIEU_YEU_CAU_TRANG_THIET_BI_LAO_DONG: <CreateTicketLaborEquipment />,
  MENU_LICH_SU_TRANG_THIET_BI_LAO_DONG: <TicketLaborEquipmentHistory />,
  MENU_QUAN_LY_THIET_BI_LAO_DONG: <ManageTicketLaborEquipment />,
  // Promote transfer
  MENU_DANH_MUC_BO_NHIEM_VA_DIEU_CHUYEN: <CategoryPosition />,
  MENU_TAO_PHIEU_BO_NHIEM_DIEU_CHUYEN: <CreatePromotionTransfer />,
  MENU_DANH_SACH_BO_NHIEM_DIEU_CHUYEN: <PromotionTransfer />,
  MENU_LICH_SU_DANH_SACH_BO_NHIEM_DIEU_CHUYEN: <PromotionTransferHistory />,
  MENU_QUAN_LY_BO_NHIEM_VA_DIEU_CHUYEN: <ManagePromotionTransfer />,
  //Intern request
  MENU_TAO_PHIEU_THUC_TAP: <CreateInternRequest />,
  MENU_YEU_CAU_THUC_TAP: <InternRequest />,
  MENU_LICH_SU_YEU_CAU_THUC_TAP: <InternRequestHistory />,
  MENU_QUAN_LY_THU_VIEC: <ManageInternRequest />,
  // On leave
  MENU_TAO_PHIEU_DANG_KY_NGAY_NGHI: <CreateOnLeave />,
  MENU_DANH_SACH_DANG_KY_NGAY_NGHI: <OnLeave />,
  MENU_LICH_SU_DANG_KY_NGAY_NGHI: <OnLeaveHistory />,
  MENU_QUAN_LY_NGHI_PHEP: <ManageOnLeave />,
  // overtime
  MENU_LICH_SU_DANG_KY_LICH_TANG_CA: <OvertimeHistory />,
  MENU_TAO_PHIEU_DANG_KY_LICH_TANG_CA: <CreateOvertime />,
  MENU_DANG_KY_LICH_TANG_CA: <Overtime />,
  MENU_QUAN_LY_TANG_CA: <ManageOverTime />,
  // resign
  MENU_DANH_SACH_DON_XIN_THOI_VIEC: <Resign />,
  MENU_TAO_PHIEU_XIN_THOI_VIEC: <CreateResign />,
  MENU_LICH_SU_DANH_SACH_XIN_THOI_VIEC: <ResignHistory />,
  MENU_QUAN_LY_THOI_VIEC: <ManageResign />,
  // businessTrip
  MENU_DANH_SACH_DANG_KY_CONG_TAC: <BusinessTrip />,
  MENU_LICH_SU_DANG_KY_CONG_TAC: <BusinessTripHistory />,
  MENU_TAO_PHIEU_DANG_KY_CONG_TAC: <CreateBusinessTrip />,
  MENU_QUAN_LY_CONG_TAC: <ManageBusinessTrip />,
  // Hiring
  MENU_DANH_MUC_THONG_TIN_TUYEN_DUNG: <CategoryNews />,
  MENU_THONG_TIN_CONG_TY: <CompanyInformation />,
  MENU_THONG_TIN_UNG_VIEN: <Candidate />,
  MENU_THONG_TIN_TUYEN_DUNG: <News />,
  // Calculate working days
  MENU_QUAN_LY_CHAM_CONG: <ManageCalculateWorkingDays></ManageCalculateWorkingDays>,
  DANH_MUC_TIEU_CHI_DANH_GIA: <CategoryCriteria />,
  "resignation-application": <ManageResignation />
};
