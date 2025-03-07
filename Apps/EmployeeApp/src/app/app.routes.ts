import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TransportComponent } from './transport/transport.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { BikesComponent } from './bikes/bikes.component';
import { ScootersComponent } from './scooters/scooters.component';
import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';
import { AccountsComponent } from './accounts/accounts.component';

export const routes: Routes = [
    {path:"",component:LoginComponent},
    {path:"transport",component:TransportComponent,children:[
    { path: 'cars', component: VehiclesComponent},
    { path: 'bikes', component: BikesComponent},
    { path: 'scooters', component: ScootersComponent},
    { path: 'manufacturer-add', component: AddManufacturerComponent},
    { path: 'accounts', component: AccountsComponent},
    ]},
    {path:"**",component:LoginComponent},
];
