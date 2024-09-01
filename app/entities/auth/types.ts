export interface IRegister {
  id?: string;
  email: string;
  name: string;
  password: string;
  password2: string;
  passwordHash: string;
  profile?: string | null;
  _count: {
    review: number;
    followers: number;
    following: number;
  };
}

export interface IAuthProps {
  email: string;
  name: string;
  password: string;
  profile: string | null;
}

export interface IValidate {
  email: string;
  password: string;
  password2: string;
  userExists: boolean;
}

export type IRegisterErrors = Record<string, string>;
