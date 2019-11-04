export default interface Truck {
  id?: number;
  width: number;
  length: number;
  height: number;
  weight: number;
  pallets: number;
  palletsId: [[number]];
  urn: string;
}
