import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChosenDataService {

  truck: object;
  pallet: object;
  cargo: object[];

  constructor() {
    this.cargo = [];
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

  addCargo(cargo: object) {
    if (!this.truckIsChosen()) {
      alert('Вы не выбрали грузовик.');
      return;
    }

    if (!this.palletIsChosen()) {
      alert('Вы не выбрали паллет.');
      return;
    }

    // @ts-ignore
    if (this.truck.maxPallets === this.cargo.length) {
      alert('Вы не можете добавить груза больше, чем есть паллетов.');
      return;
    }

    // @ts-ignore
    if (cargo.length > this.pallet.length || cargo.width > this.pallet.width || cargo.height > this.pallet.height) {
      alert('Груз не поместится на паллет.');
      return;
    }

    let currentWeight = 0;
    this.cargo.map(item => {
      // @ts-ignore
      currentWeight += Number(item.weight) + Number(this.pallet.weight);
    });
    // @ts-ignore
    if (Number(currentWeight) + Number(this.pallet.weight) + Number(cargo.weight) > this.truck.weight) {
      alert('Вес всего груза будет больше грузоподъемности грузовика.');
      return;
    }

    this.cargo.push(cargo);
  }

}
