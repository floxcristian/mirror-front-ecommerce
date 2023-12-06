export interface ReviewSummary {
  stars: number;
  quantity: number;
  percentage?: number;
}

export interface IReviewsResponse {
  total: number;
  average: number;
  summary: ReviewSummary[];
}
