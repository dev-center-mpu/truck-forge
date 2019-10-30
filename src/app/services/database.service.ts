import {Injectable} from '@angular/core';
import * as database from '../../assets/db.json';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // @ts-ignore
  trucks = database.default.trucks;

  // @ts-ignore
  pallets = database.default.pallets;

}
