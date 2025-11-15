export interface ResignationDTO {
  id: number;
  referenceNumber: string;
  isExpiredLaborContractDate: boolean;
  officialResignationDate: number;
  shuibookCode: number;
  reasonForActionCode: string;
  unusedLeaveDate: number;
  contractTypeCode: number;
  suggestionForLastWorkingDay: Date;
  isAgree: boolean;
  created: Date;
  modified: Date;
}
