export interface IUpdatePasswordRequest {
  documentId: string;
  username: string;
  currentPassword: string;
  newPassword: string;
}
