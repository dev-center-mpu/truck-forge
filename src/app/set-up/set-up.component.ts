import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../services/database.service';

@Component({
  selector: 'app-set-up',
  templateUrl: './set-up.component.html',
  styleUrls: ['./set-up.component.scss']
})
export class SetUpComponent implements OnInit {

  private trucks: [object];
  private pallets: [object];

  constructor(private database: DatabaseService) {
    this.trucks = this.database.trucks;
    this.pallets = this.database.trucks;
  }

  ngOnInit() {
  }

}
