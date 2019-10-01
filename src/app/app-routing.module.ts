import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SetUpComponent} from './set-up/set-up.component';

const routes: Routes = [
  {path: '', component: SetUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
