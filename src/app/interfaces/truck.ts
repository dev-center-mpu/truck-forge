export default interface Truck {
  id?: number;
  width: number;
  length: number;
  height: number;
  weight: number;
  pallets: number;
  palletsId: Array<number[]>;
  urn: string;
  leftWallId: number;
}
