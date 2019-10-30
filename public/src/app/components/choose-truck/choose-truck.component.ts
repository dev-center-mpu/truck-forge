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
}
