import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InitialSetUpComponent} from './components/initial-set-up/initial-set-up.component';
import {TruckSetUpComponent} from './components/truck-set-up/truck-set-up.component';

const routes: Routes = [
  {path: '', component: InitialSetUpComponent},
  {path: 'viewer', component: TruckSetUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
