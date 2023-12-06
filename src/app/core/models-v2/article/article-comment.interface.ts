export interface ArticleComment {
  sku: string;
  calification: number;
  title?: string;
  comment?: string;
  recommended?: boolean | null;
  name: string;
  email: string;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface CommentSummary {
  quantity: number;
  stars: number;
  percentage?: number;
}
