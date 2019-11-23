import {Injectable} from '@angular/core';
import Truck from '../interfaces/truck';
import Pallet from '../interfaces/pallet';
import Cargo from '../interfaces/cargo';

@Injectable({
  providedIn: 'root'
})
export class ChosenDataService {

  truck: Truck;
  pallet: Pallet;
  cargo: Cargo[];
  crate: Cargo;

  constructor() {
    this.cargo = [];

    // TODO: Delete above lines.
    this.truck = {
      id: 1,
      weight: 1000,
      length: 2800,
      width: 1800,
      height: 1800,
      pallets: 4,
      palletsId: [[275, 271], [277, 273]],
      urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dHJ1Y2tfZm9yZ2UvMi04XzEtOF8xLTguc3Rw'

    };
    this.pallet = {length: 1200, width: 800, height: 145, weight: 5};
    this.cargo = [{weight: 700, length: 1200, width: 800, height: 145}, {weight: 700, length: 1000, width: 500, height: 1000}];
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

  addCrate(crate: Cargo) {
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

    if (crate.length > this.pallet.length || crate.width > this.pallet.width) {
      alert('Груз не поместится на паллет.');
      return;
    }

    if (crate.height > this.truck.height - this.pallet.height) {
      alert('Груз не поместится по высоте');
      return;
    }

    let currentWeight = 0;
    this.cargo.map(obj => {
      currentWeight += +obj.weight + +this.pallet.weight;
    });

    if (+currentWeight + +this.pallet.weight + +crate.weight > this.truck.weight) {
      alert('Вес всего груза будет больше грузоподъемности грузовика.');
      return;
    }

    this.cargo.push(crate);
  }

  selectCrate(crate: Cargo) {
    if (this.crate !== undefined) {
      return;
    }
    this.crate = crate;
    for (let i = 0; i < this.cargo.length; i++) {
      const obj = this.cargo[i];
      const length: boolean = obj.length === crate.length;
      const width: boolean = obj.width === crate.width;
      const height: boolean = obj.height === crate.height;
      const weight: boolean = obj.weight === crate.weight;
      if (length && width && height && weight) {
        this.cargo.splice(i, 1);
        break;
      }
    }
  }

  unselectCrate() {
    if (this.crate === undefined) {
      return;
    }
    this.cargo.push(this.crate);
    this.crate = undefined;
  }

  crateDisplayData(): string {
    return this.crate === undefined
      ? 'Груз не выбран'
      : `${this.crate.length}x${this.crate.width}x${this.crate.height} мм с весом ${this.crate.weight} кг`;
  }
}
