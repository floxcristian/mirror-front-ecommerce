export interface IBlogsResponse {
  data: IBlog[];
}

export interface IBlogResponse {
  data: IBlog;
}

export interface IBlog {
  pageId: string;
  image: string;
  title: string;
  titleDrop: string;
  text?: string;
  createdAt: string | null;
  updatedAt: string | null;
}
