import {Component} from '@angular/core';
import {ChosenDataService} from '../../services/chosen-data.service';

@Component({
  selector: 'app-cargo-list',
  templateUrl: './cargo-list.component.html',
  styleUrls: ['./cargo-list.component.scss']
})
export class CargoListComponent {

  constructor(private chosenData: ChosenDataService) {
  }
}
