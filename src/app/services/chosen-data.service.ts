import { Injectable } from '@angular/core';
import Truck from '../interfaces/truck';
import Pallet from '../interfaces/pallet';
import Cargo from '../interfaces/cargo';
import ViewerPallet from '../interfaces/viewer-pallet';

@Injectable({
  providedIn: 'root'
})
export class ChosenDataService {

  truck: Truck;
  pallet: Pallet;
  cargo: Cargo[];
  crate: Cargo;
  pallets: Array<ViewerPallet[]>;

  constructor() {
    this.cargo = [];
  }

  massCenterCalculation(): {x: number, y: number, z: number} {
    let i: number;

    // Mass center by X
    let massCenterXTemp = 0;
    let massX = 0;
    i = 0;
    for (const palletsLine of this.pallets) {
      for (const pallet of palletsLine) {
        const crate = pallet.crate;
        if (crate !== undefined) {
          const offset = +this.pallet.length * +i + +this.pallet.length / 2
          massCenterXTemp += +offset * +crate.weight / 1000;
          massX += +crate.weight / 1000;
        }
      }
      i += 1;
    }

    const massCenterX = (this.truck.length / 2) - (massCenterXTemp / massX);
    // Mass center by Y
    let massCenterYTemp = 0;
    let massY = 0;
    for (const palletsLine of this.pallets) {
      i = 0;
      for (const pallet of palletsLine) {
        const crate = pallet.crate;
        if (crate !== undefined) {
          const offset = +this.pallet.width * +i + +this.pallet.width / 2;
          massCenterYTemp += +offset * +crate.weight / 1000;
          massY += +crate.weight / 1000;
        }
        i += 1;
      }
    }
    const massCenterY = (this.truck.width / 2) - (massCenterYTemp / massY);

    // Mass center by Z
    let massCenterZTemp = 0;
    let massZ = 0;
    for (const palletsLine of this.pallets) {
      for (const pallet of palletsLine) {
        const crate = pallet.crate;
        if (crate !== undefined) {
          massCenterZTemp += +crate.weight / 1000 * +crate.height / 2;
          massZ += +crate.weight / 1000;
        }
      }
    }
    const massCenterZ = massCenterZTemp / massZ;

    return {x: massCenterX, y: massCenterY, z: massCenterZ};
  }

  truckIsChosen(): boolean {
    return this.truck !== undefined;
  }

  deleteCargo(id: number) {
    this.cargo.splice(id, 1);
  }

  palletIsChosen(): boolean {
    return this.truck !== undefined;
  }

  cargoIsChosen(): boolean {
    return this.cargo.length !== 0;
  }

  addCrate(crate: Cargo, forceAdd: boolean = false) {
    if (forceAdd) {
      for (const obj of this.cargo) {
        if (obj.id === crate.id) {
          return;
        }
      }
      this.cargo.push(crate);
      return;
    }

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
