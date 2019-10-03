import {Component} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {ChosenDataService} from '../../services/chosen-data.service';

@Component({
  selector: 'app-choose-truck',
  templateUrl: './choose-truck.component.html',
  styleUrls: ['./choose-truck.component.scss']
})
export class ChooseTruckComponent {

  private readonly trucks: [object];

  constructor(
    private database: DatabaseService,
    private chosenData: ChosenDataService
  ) {
    this.trucks = this.database.trucks;
  }

  techSpecValue(truckIndex, valueName): string {
    let value;
    const truck = this.trucks[truckIndex];
    switch (valueName) {
      case 'length':
        // @ts-ignore
        value = truck.minLength === truck.maxLength ? truck.minLength / 1000 : `${truck.minLength / 1000} - ${truck.maxLength / 1000}`;
        break;
      case 'width':
        // @ts-ignore
        value = truck.minWidth === truck.maxWidth ? truck.minWidth / 1000 : `${truck.minWidth / 1000} - ${truck.maxWidth / 1000}`;
        break;
      case 'height':
        // @ts-ignore
        value = truck.minHeight === truck.maxHeight ? truck.minHeight / 1000 : `${truck.minHeight / 1000} - ${truck.maxHeight / 1000}`;
        break;
      case 'pallets':
        // @ts-ignore
        value = truck.minPallets === truck.maxPallets ? truck.minPallets : `${truck.minPallets} - ${truck.maxPallets}`;
        break;
    }
    return value;
  }

  chooseTruck(index) {
    const truck = this.trucks[index];
    this.chosenData.chooseTruck(truck);
  }
}
