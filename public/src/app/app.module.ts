import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {InitialSetUpComponent} from './components/initial-set-up/initial-set-up.component';
import {ChooseTruckComponent} from './components/choose-truck/choose-truck.component';
import {ChoosePalletComponent} from './components/choose-pallet/choose-pallet.component';
import {ChooseCargoComponent} from './components/choose-cargo/choose-cargo.component';
import {TruckSetUpComponent} from './components/truck-set-up/truck-set-up.component';
import {ViewerModule} from 'ng2-adsk-forge-viewer';
import {CheckChosenItemsComponent} from './components/check-chosen-items/check-chosen-items.component';
import {TruckSetUpComponent} from './components/truck-set-up/truck-set-up.component';

@NgModule({
  declarations: [
    AppComponent,
    InitialSetUpComponent,
    TruckSetUpComponent,
    ChooseTruckComponent,
    ChoosePalletComponent,
    ChooseCargoComponent,
    CheckChosenItemsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
