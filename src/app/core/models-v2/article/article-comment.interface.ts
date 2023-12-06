export interface CommentSummary {
  quantity: number;
  stars: number;
  percentage?: number;
}
export interface RatingSummary {
  stars: number;
  quantity: number;
}

export interface RatingsResponse {
  total: number;
  average: number;
  summary: RatingSummary[];
}

