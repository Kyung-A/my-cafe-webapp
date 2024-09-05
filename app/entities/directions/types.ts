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
