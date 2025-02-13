import {Component} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {ChosenDataService} from '../../services/chosen-data.service';
import Truck from '../../interfaces/truck';

@Component({
  selector: 'app-choose-truck',
  templateUrl: './choose-truck.component.html',
  styleUrls: ['./choose-truck.component.scss']
})
export class ChooseTruckComponent {

  readonly trucks: Truck[];

  constructor(
    public database: DatabaseService,
    public chosenData: ChosenDataService
  ) {
    this.trucks = this.database.trucks;
  }
  onChoseTruck(truck){
    this.chosenData.truck = truck;
    
  }
}
