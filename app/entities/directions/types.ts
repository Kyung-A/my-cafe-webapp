/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPolyline {
  La: number;
  Ma: number;
}

export interface IRoads {
  distance: number;
  duration: number;
  name: string;
  traffic_speed: number;
  traffic_state: number;
  vertexes: number[];
}

export type IDirections = Record<string, any>;
