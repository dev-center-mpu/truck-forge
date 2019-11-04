import {Component} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {ChosenDataService} from '../../services/chosen-data.service';
import Pallet from '../../interfaces/pallet';

@Component({
  selector: 'app-choose-pallet',
  templateUrl: './choose-pallet.component.html',
  styleUrls: ['./choose-pallet.component.scss']
})
export class ChoosePalletComponent {

  readonly pallets: Pallet[];

  constructor(
    private database: DatabaseService,
    private chosenData: ChosenDataService
  ) {
    this.pallets = this.database.pallets;
  }
}
