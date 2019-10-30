import {Component} from '@angular/core';
import {ChosenDataService} from '../../services/chosen-data.service';
import {Cargo} from '../../interfaces/cargo';

@Component({
  selector: 'app-cargo-list',
  templateUrl: './cargo-list.component.html',
  styleUrls: ['./cargo-list.component.scss']
})
export class CargoListComponent {

  cargo: Cargo[];

  constructor(private chosenData: ChosenDataService) {
    this.cargo = chosenData.cargo;
  }

  chooseCrate(crate: Cargo) {
    this.chosenData.crate = crate;
  }
}
