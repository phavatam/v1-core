import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
//import { createLogger } from "redux-logger";
import rootSaga from "./rootSaga";
import userAuthSlice from "./userAuthSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { UserApisService } from "@API/services/UserApis.service";
import { rtkQueryErrorLogger } from "~/app/middleware";
import { AuthApisService } from "@API/services/AuthApis.service";
import { CategoryWardApisService } from "@API/services/CategoryWardApis.service";
import { CategoryDistrictApisService } from "@API/services/CategorryDistrict.service";
import { CategoryCityApisService } from "@API/services/CategoryCity.service";
import { UnitApisService } from "@API/services/UnitApis.service";
import { UserTypeApisService } from "@API/services/UserType.service";
import { RoleApisService } from "@API/services/Role.service";
import { NavigationApisService } from "@API/services/Navigation.service";
import { AllowanceApisService } from "@API/services/Allowance.service";
import { CategoryNationalityApisService } from "@API/services/CategoryNationality.service";
import { CategoryProfessionalQualificationApisService } from "@API/services/CategoryProfessionalQualification.service";
import { CategoryEducationalDegreeApisService } from "@API/services/CategoryEducationalDegree.service";
import { CategoryGovernmentManagementApisService } from "@API/services/CategoryGovernmentManagement.service";
import { CategorySalaryLevelApisService } from "@API/services/CategorySalaryLevel.service";
import { CategoryTypeSalaryScaleApisService } from "@API/services/CategoryTypeSalaryScale.service";
import { CategorySalaryScaleApisService } from "@API/services/CategorySalaryScale.service";
import { CategoryPolicyBeneficiaryApisService } from "@API/services/CategoryPolicyBeneficiary.service";
import { CategoryCompensationBenefitsApisService } from "@API/services/CategoryCompensationBenefits.service";
import { EmployeeTypeApisService } from "@API/services/EmployeeType.service";
import { EmployeeDayOffApisService } from "@API/services/EmployeeDayOff.service";
import { EmployeeApisService } from "@API/services/Employee.service";
import { EmployeeAllowanceApisService } from "@API/services/EmployeeAllowance.service";
import { EmployeeBenefitsApisService } from "@API/services/EmployeeBenefits.service";
import { CategoryVacanciesApisService } from "@API/services/CategoryVacanciesApis.service";
import { RequestToHiredApisService } from "@API/services/RequestToHiredApis.service";
import { CategoryLaborEquipmentApisService } from "@API/services/CategoryLaborEquipmentApis.service";
import { TicketLaborEquipmentApisService } from "@API/services/TicketLaborEquipmentApis.service";
import { LaborEquipmentUnitApisService } from "@API/services/LaborEquipmentUnitApis.service";
import { WorkflowTemplateApisService } from "@API/services/WorkflowTemplateApis.service";
import { WorkflowStepApisService } from "@API/services/WorkflowStepApis.service";
import { WorkFlowApisService } from "@API/services/WorkFlowApis.service";
import { CategoryPositionApisService } from "@API/services/CategoryPositionApis.service";
import { InternRequestApisService } from "@API/services/InternRequestApis.service";
import { OnLeaveApisService } from "@API/services/OnLeaveApis.service";
import { OvertimeApisService } from "@API/services/OvertimeApis.service";
import { ResignApisService } from "@API/services/ResignApis.service";
import { BusinessTripApisService } from "@API/services/BusinessTripApis.service";
import { BusinessTripEmployeeApisService } from "@API/services/BusinessTripEmployeeApis.service";
import { PositionEmployeeApisService } from "@API/services/PositionEmployeeApis.service";
import { PromotionTransferApisService } from "@API/services/PromotionTransferApis.service";
import { NewsApisService } from "@API/services/NewsApis.service";
import { CategoryNewsApisService } from "@API/services/CategoryNewsApis.service";
import { CandidateApisService } from "@API/services/CandidateApis.service";
import { CompanyInformationApisService } from "@API/services/CompanyInformationApis.service";
import { MarkWorkPointsApisService } from "@API/services/MarkWorkPointsApis.service";
import { CategoryAssessmentTypeApisService } from "@API/services/CategoryAssessmentTypeApis.service";
import { CategoryObjectGroupApisService } from "@API/services/CategoryObjectGroupApis.service";
import { CategoryStatusApisService } from "@API/services/CategoryStatusApis.service";
import { CategoryTimeTypeApisService } from "@API/services/CategoryTimeTypeApis.service";
import { CategorySourcePlanningApisService } from "@API/services/CategorySourcePlanningApis.service";
import { CategoryJobStatusApisService } from "@API/services/CategoryJobStatusApis.service";
import { TypeAssessmentApisService } from "@API/services/TypeAssessmentApis.service";
import { CategoryCriteriaApisService } from "@API/services/CategoryCriteriaApis.service";
import { EvaluationsApisService } from "@API/services/EvaluationsApis.service";
import { EvaluationsCriteriaApisService } from "@API/services/EvaluationsCriteriaApis.service";
import { EvaluationsSupervisorApisService } from "@API/services/EvaluationsSupervisorApis.service";
import { ElectronicSignatureApisService } from "@API/services/ElectronicSignatureApis.service";
import { CategoryGradingApisService } from "@API/services/CategoryGrading.service";
import { ExplaintEvaluationApisService } from "@API/services/ExplaintEvaluation.service";
import { CategoryReviewApisService } from "@API/services/CategoryReviewApis.service";

const sagaMiddleware = createSagaMiddleware();
//const logger = createLogger();
const arrMiddleware: any[] = [
  sagaMiddleware,
  ExplaintEvaluationApisService.middleware,
  EvaluationsSupervisorApisService.middleware,
  UserApisService.middleware,
  AuthApisService.middleware,
  CategoryWardApisService.middleware,
  CategoryDistrictApisService.middleware,
  CategoryCityApisService.middleware,
  UnitApisService.middleware,
  UserTypeApisService.middleware,
  RoleApisService.middleware,
  NavigationApisService.middleware,
  AllowanceApisService.middleware,
  CategoryNationalityApisService.middleware,
  CategoryProfessionalQualificationApisService.middleware,
  CategoryEducationalDegreeApisService.middleware,
  CategoryGovernmentManagementApisService.middleware,
  CategorySalaryLevelApisService.middleware,
  CategoryTypeSalaryScaleApisService.middleware,
  CategorySalaryScaleApisService.middleware,
  CategoryPolicyBeneficiaryApisService.middleware,
  CategoryCompensationBenefitsApisService.middleware,
  EmployeeTypeApisService.middleware,
  EmployeeDayOffApisService.middleware,
  EmployeeTypeApisService.middleware,
  EmployeeApisService.middleware,
  EmployeeAllowanceApisService.middleware,
  EmployeeBenefitsApisService.middleware,
  CategoryVacanciesApisService.middleware,
  RequestToHiredApisService.middleware,
  CategoryLaborEquipmentApisService.middleware,
  TicketLaborEquipmentApisService.middleware,
  LaborEquipmentUnitApisService.middleware,
  WorkflowTemplateApisService.middleware,
  WorkflowStepApisService.middleware,
  WorkFlowApisService.middleware,
  CategoryPositionApisService.middleware,
  InternRequestApisService.middleware,
  OnLeaveApisService.middleware,
  OvertimeApisService.middleware,
  ResignApisService.middleware,
  BusinessTripApisService.middleware,
  BusinessTripEmployeeApisService.middleware,
  PositionEmployeeApisService.middleware,
  PromotionTransferApisService.middleware,
  NewsApisService.middleware,
  CategoryNewsApisService.middleware,
  CandidateApisService.middleware,
  CompanyInformationApisService.middleware,
  MarkWorkPointsApisService.middleware,
  CategoryAssessmentTypeApisService.middleware,
  CategoryObjectGroupApisService.middleware,
  CategoryStatusApisService.middleware,
  CategoryTimeTypeApisService.middleware,
  CategorySourcePlanningApisService.middleware,
  CategoryJobStatusApisService.middleware,
  TypeAssessmentApisService.middleware,
  CategoryCriteriaApisService.middleware,
  EvaluationsApisService.middleware,
  EvaluationsCriteriaApisService.middleware,
  ElectronicSignatureApisService.middleware,
  CategoryGradingApisService.middleware,
  CategoryReviewApisService.middleware,

  rtkQueryErrorLogger
];
if (process.env.NODE_ENV === "development") {
  // Ràng redux logger chỉ chạy trong môi trường phát triển
  // arrMiddleware.push(logger);
}
export const store = configureStore({
  reducer: {
    userAuthSlice: userAuthSlice.reducer,
    [EvaluationsSupervisorApisService.reducerPath]: EvaluationsSupervisorApisService.reducer,
    [ExplaintEvaluationApisService.reducerPath]: ExplaintEvaluationApisService.reducer,
    [CategoryGradingApisService.reducerPath]: CategoryGradingApisService.reducer,
    [UserApisService.reducerPath]: UserApisService.reducer,
    [AuthApisService.reducerPath]: AuthApisService.reducer,
    [CategoryWardApisService.reducerPath]: CategoryWardApisService.reducer,
    [CategoryDistrictApisService.reducerPath]: CategoryDistrictApisService.reducer,
    [CategoryCityApisService.reducerPath]: CategoryCityApisService.reducer,
    [UnitApisService.reducerPath]: UnitApisService.reducer,
    [UserTypeApisService.reducerPath]: UserTypeApisService.reducer,
    [RoleApisService.reducerPath]: RoleApisService.reducer,
    [NavigationApisService.reducerPath]: NavigationApisService.reducer,
    [AllowanceApisService.reducerPath]: AllowanceApisService.reducer,
    [CategoryNationalityApisService.reducerPath]: CategoryNationalityApisService.reducer,
    [CategoryProfessionalQualificationApisService.reducerPath]: CategoryProfessionalQualificationApisService.reducer,
    [CategoryEducationalDegreeApisService.reducerPath]: CategoryEducationalDegreeApisService.reducer,
    [CategoryGovernmentManagementApisService.reducerPath]: CategoryGovernmentManagementApisService.reducer,
    [CategorySalaryLevelApisService.reducerPath]: CategorySalaryLevelApisService.reducer,
    [CategoryTypeSalaryScaleApisService.reducerPath]: CategoryTypeSalaryScaleApisService.reducer,
    [CategorySalaryScaleApisService.reducerPath]: CategorySalaryScaleApisService.reducer,
    [CategoryPolicyBeneficiaryApisService.reducerPath]: CategoryPolicyBeneficiaryApisService.reducer,
    [CategoryCompensationBenefitsApisService.reducerPath]: CategoryCompensationBenefitsApisService.reducer,
    [EmployeeTypeApisService.reducerPath]: EmployeeTypeApisService.reducer,
    [EmployeeDayOffApisService.reducerPath]: EmployeeDayOffApisService.reducer,
    [EmployeeApisService.reducerPath]: EmployeeApisService.reducer,
    [EmployeeAllowanceApisService.reducerPath]: EmployeeAllowanceApisService.reducer,
    [EmployeeBenefitsApisService.reducerPath]: EmployeeBenefitsApisService.reducer,
    [CategoryVacanciesApisService.reducerPath]: CategoryVacanciesApisService.reducer,
    [RequestToHiredApisService.reducerPath]: RequestToHiredApisService.reducer,
    [CategoryLaborEquipmentApisService.reducerPath]: CategoryLaborEquipmentApisService.reducer,
    [TicketLaborEquipmentApisService.reducerPath]: TicketLaborEquipmentApisService.reducer,
    [LaborEquipmentUnitApisService.reducerPath]: LaborEquipmentUnitApisService.reducer,
    [WorkflowTemplateApisService.reducerPath]: WorkflowTemplateApisService.reducer,
    [WorkflowStepApisService.reducerPath]: WorkflowStepApisService.reducer,
    [WorkFlowApisService.reducerPath]: WorkFlowApisService.reducer,
    [CategoryPositionApisService.reducerPath]: CategoryPositionApisService.reducer,
    [InternRequestApisService.reducerPath]: InternRequestApisService.reducer,
    [OnLeaveApisService.reducerPath]: OnLeaveApisService.reducer,
    [OvertimeApisService.reducerPath]: OvertimeApisService.reducer,
    [ResignApisService.reducerPath]: ResignApisService.reducer,
    [BusinessTripApisService.reducerPath]: BusinessTripApisService.reducer,
    [BusinessTripEmployeeApisService.reducerPath]: BusinessTripEmployeeApisService.reducer,
    [PositionEmployeeApisService.reducerPath]: PositionEmployeeApisService.reducer,
    [PromotionTransferApisService.reducerPath]: PromotionTransferApisService.reducer,
    [NewsApisService.reducerPath]: NewsApisService.reducer,
    [CategoryNewsApisService.reducerPath]: CategoryNewsApisService.reducer,
    [CandidateApisService.reducerPath]: CandidateApisService.reducer,
    [CompanyInformationApisService.reducerPath]: CompanyInformationApisService.reducer,
    [MarkWorkPointsApisService.reducerPath]: MarkWorkPointsApisService.reducer,
    [CategoryAssessmentTypeApisService.reducerPath]: CategoryAssessmentTypeApisService.reducer,
    [CategoryReviewApisService.reducerPath]: CategoryReviewApisService.reducer,
    [CategoryObjectGroupApisService.reducerPath]: CategoryObjectGroupApisService.reducer,
    [CategoryStatusApisService.reducerPath]: CategoryStatusApisService.reducer,
    [CategoryTimeTypeApisService.reducerPath]: CategoryTimeTypeApisService.reducer,
    [CategorySourcePlanningApisService.reducerPath]: CategorySourcePlanningApisService.reducer,
    [CategoryJobStatusApisService.reducerPath]: CategoryJobStatusApisService.reducer,
    [TypeAssessmentApisService.reducerPath]: TypeAssessmentApisService.reducer,
    [CategoryCriteriaApisService.reducerPath]: CategoryCriteriaApisService.reducer,
    [EvaluationsApisService.reducerPath]: EvaluationsApisService.reducer,
    [EvaluationsCriteriaApisService.reducerPath]: EvaluationsCriteriaApisService.reducer,
    [ElectronicSignatureApisService.reducerPath]: ElectronicSignatureApisService.reducer
  },
  devTools: false,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...arrMiddleware)
});
setupListeners(store.dispatch);
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
