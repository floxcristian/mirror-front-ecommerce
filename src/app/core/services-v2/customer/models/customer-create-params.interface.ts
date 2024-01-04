export interface ICustomerCreateParams {
  email: string;
  password: string;
  documentId: string;
  firstName: string;
  lastName: string;
  businessLine: string;
  businessName: string;
  isCompanyUser: boolean;
  // Contact
  phone: string;
  position: string;
  contactDocumentId: string;
  // Address
  city: string;
  street: string;
  streetNumber: string;
  departmentOrHouse: string;
  locality: string;
  reference: string;
  latitude: number;
  longitude: number;
}
