import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChosenDataService} from '../../services/chosen-data.service';

@Component({
  selector: 'app-choose-cargo',
  templateUrl: './choose-cargo.component.html',
  styleUrls: ['./choose-cargo.component.scss']
})
export class ChooseCargoComponent {

  form: FormGroup;

  constructor(public chosenData: ChosenDataService) {
    this.form = new FormGroup({
      length: new FormControl(null, [Validators.required]),
      width: new FormControl(null, [Validators.required]),
      height: new FormControl(null, [Validators.required]),
      weight: new FormControl(null, [Validators.required])
    });
  }
}
