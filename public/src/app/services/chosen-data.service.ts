import {Injectable} from '@angular/core';

interface Truck {
  id?: number;
  width: number;
  length: number;
  height: number;
  weight: number;
  pallets: number;
}

interface Pallet {
  id?: number;
  width: number;
  length: number;
  height: number;
  weight: number;
}

interface Cargo {
  width: number;
  length: number;
  height: number;
  weight: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChosenDataService {

  truck: Truck;
  pallet: Pallet;
  cargo: Cargo[];

  constructor() {
    this.cargo = [];

    // TODO: Delete this lines.
    this.truck = {weight: 700, length: 1200, width: 1000, height: 1200, pallets: 1};
    this.pallet = {length: 1200, width: 800, height: 145, weight: 5};
    this.cargo = [{weight: 700, length: 1200, width: 800, height: 145}];
  }

  truckIsChosen(): boolean {
    return this.truck !== undefined;
  }

  palletIsChosen(): boolean {
    return this.truck !== undefined;
  }

  cargoIsChosen(): boolean {
    return this.cargo.length !== 0;
  }

  addCargo(cargo: Cargo) {
    if (!this.truckIsChosen()) {
      alert('Вы не выбрали грузовик.');
      return;
    }

    if (!this.palletIsChosen()) {
      alert('Вы не выбрали паллет.');
      return;
    }

    if (this.truck.pallets === this.cargo.length) {
      alert('Вы не можете добавить груза больше, чем есть паллетов.');
      return;
    }

    if (cargo.length > this.pallet.length || cargo.width > this.pallet.width || cargo.height > this.pallet.height) {
      alert('Груз не поместится на паллет.');
      return;
    }

    let currentWeight = 0;
    this.cargo.map(crate => {
      currentWeight += Number(crate.weight) + Number(this.pallet.weight);
    });

    if (Number(currentWeight) + Number(this.pallet.weight) + Number(cargo.weight) > this.truck.weight) {
      alert('Вес всего груза будет больше грузоподъемности грузовика.');
      return;
    }

    this.cargo.push(cargo);
  }
}
