import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChosenDataService {

  private truck: object;
  private pallet: object;

  chooseTruck(truck: object) {
    this.truck = truck;
  }

  choosePallet(pallet: object) {
    this.pallet = pallet;
  }
}
