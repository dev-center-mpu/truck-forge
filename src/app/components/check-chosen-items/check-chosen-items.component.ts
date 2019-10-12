import {Component} from '@angular/core';
import {ChosenDataService} from '../../services/chosen-data.service';

@Component({
  selector: 'app-check-chosen-items',
  templateUrl: './check-chosen-items.component.html',
  styleUrls: ['./check-chosen-items.component.scss']
})
export class CheckChosenItemsComponent {

  constructor(private chosenData: ChosenDataService) {
  }

  settingsAreDone(): boolean {
    return this.chosenData.truckIsChosen() && this.chosenData.palletIsChosen() && this.chosenData.cargoIsChosen();
  }

}
