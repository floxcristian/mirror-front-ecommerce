export interface IComment {
  sku: string;
  calification: number;
  title: string;
  comment: string;
  recommended: boolean
  name: string;
  email: string;
  username?: string;
  createdAt : string ;
  updatedAt: string ;
}

export interface ICommentResponse {
  data: IComment[];
}
