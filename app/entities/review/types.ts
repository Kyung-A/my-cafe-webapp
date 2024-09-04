import { IRegister } from "../auth/types";

export interface IReview {
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
  likedBy?: IRegister;
  reviewImages: string | null;
}
