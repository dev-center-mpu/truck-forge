import {Component} from '@angular/core';
import {ChosenDataService} from '../../services/chosen-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-check-chosen-items',
  templateUrl: './check-chosen-items.component.html',
  styleUrls: ['./check-chosen-items.component.scss']
})
export class CheckChosenItemsComponent {

  canDelete: boolean = true;
  id: number;

  constructor(
    private activatedRouter: ActivatedRoute,
    private chosenData: ChosenDataService) {
    this.activatedRouter.params.subscribe(param => {
      this.id = param.id;
      console.log(param.model);
    })
  }

  settingsAreDone(): boolean {
    return this.chosenData.truckIsChosen() && this.chosenData.palletIsChosen() && this.chosenData.cargoIsChosen();
  }


  canBeDeleted(): boolean{
    return this.canDelete;
  }

  letDelete(){
    this.canDelete = !this.canDelete;
  }
}
