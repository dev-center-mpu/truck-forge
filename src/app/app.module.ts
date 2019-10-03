import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {InitialSetUpComponent} from './components/initial-set-up/initial-set-up.component';
import {TruckSetUpComponent} from './components/truck-set-up/truck-set-up.component';
import {ChooseTruckComponent} from './components/choose-truck/choose-truck.component';

@NgModule({
  declarations: [
    AppComponent,
    InitialSetUpComponent,
    TruckSetUpComponent,
    ChooseTruckComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
