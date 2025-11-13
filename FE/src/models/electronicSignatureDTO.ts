export interface ElectronicSignatureDTO {
  id: string;
  status: number | null;
  createdDate: Date;
  idUser: string | null;
  publicKey: number;
  privateKey: string | null;
}
