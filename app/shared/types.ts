export interface IGeocoder {
  address_name: string;
  code: "string";
  region_1depth_name: "string";
  region_2depth_name: "string";
  region_3depth_name: "string";
  region_4depth_name: "string";
  region_type: "string";
  x: number;
  y: number;
}

export interface ICafeResponse {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}

export interface ICafePagination {
  current: number;
  first: number;
  gotoFirst: () => void;
  gotoLast: () => void;
  gotoPage: (e: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  last: number;
  nextPage: () => void;
  perPage: number;
  prevPage: () => void;
  totalCount: number;
}

export interface IMarketPostion {
  La: number;
  Ma: number;
}

export interface IMenu {
  id: string;
  name: string;
  href?: string;
  active: boolean;
}

export interface IRegister {
  id: string;
  email: string;
  name: string;
  password?: string;
  password2?: string;
}

export interface ISignin {
  email: string;
  password: string;
}
