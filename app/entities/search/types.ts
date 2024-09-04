/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IDataResponse {
  data: ISearchData[];
  paging: IDataPagination;
}

export interface ISearchData {
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
  reviewId?: string;
  review?: string;
  visited?: boolean;
}

export interface IDataPagination {
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

export type IMarker = Record<string, any>;
export type IMapData = Record<string, any>;
export type IClusterer = Record<string, any>;
