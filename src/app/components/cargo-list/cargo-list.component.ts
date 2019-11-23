import {Component, EventEmitter, Output} from '@angular/core';
import {ChosenDataService} from '../../services/chosen-data.service';

@Component({
  selector: 'app-cargo-list',
  templateUrl: './cargo-list.component.html',
  styleUrls: ['./cargo-list.component.scss']
})
export class CargoListComponent {

  @Output() calculate = new EventEmitter<{x: number, y: number, z: number}>();

  constructor(private chosenData: ChosenDataService) {
  }

  massCalculation() {
    this.calculate.emit(this.chosenData.massCenterCalculation());
  }
}
