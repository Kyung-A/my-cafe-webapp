export interface IProfile {
  id: string;
  email: string;
  name: string;
  profile: string | null;
  _count: {
    review: number;
    followers: number;
    following: number;
  };
}
