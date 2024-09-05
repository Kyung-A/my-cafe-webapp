export interface ILikedProps {
  isLiked?: string;
  reviewId: string;
  userId: string;
}

export interface IReview {
  reviewId?: string;
  id: string;
  cafeId: string;
  authorId: string;
  name: string;
  description: string;
  starRating: number;
  visited: boolean;
  good: string;
  notGood: string;
  tags: string | null;
  recommend: string;
  x: string;
  y: string;
  likedBy?: Record<string, string>;
  reviewImages: string | null;
}
