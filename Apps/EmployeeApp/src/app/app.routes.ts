import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TransportComponent } from './transport/transport.component';
import { VehiclesComponent } from './cars/vehicles.component';
import { BikesComponent } from './bikes/bikes.component';
import { ScootersComponent } from './scooters/scooters.component';
import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';
import { AccountsComponent } from './accounts/accounts.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { OperaterComponent } from './operater/operater.component';
import { RentalsComponent } from './rentals/rentals.component';
import { VehicleMapComponent } from './vehicle-map/vehicle-map.component';
import { ClientsComponent } from './clients/clients.component';
import { MalfunctionsComponent } from './malfunctions/malfunctions.component';
import { ManagerComponent } from './manager/manager.component';
import { RentPriceComponent } from './rent-price/rent-price.component';
import { StatisticsComponent } from './statistics/statistics.component';

export const routes: Routes = [
    {path:"",component:LoginComponent},
    {path:"transport",component:TransportComponent,children:[
    { path: 'cars', component: VehiclesComponent},
    { path: 'bikes', component: BikesComponent},
    { path: 'scooters', component: ScootersComponent},
    { path: 'manufacturer-add', component: AddManufacturerComponent},
    { path: 'accounts', component: AccountsComponent},
    {path: 'details', component: VehicleDetailsComponent},
    ]},
    {path:"operator",component:OperaterComponent,children:[
    {path:'rentals',component:RentalsComponent},
    {path:'map',component:VehicleMapComponent},
    {path:'clients',component:ClientsComponent},
    {path:'malfunctions',component:MalfunctionsComponent}
    ]},
    {path:"manager",component:ManagerComponent,children:[
    { path: 'cars', component: VehiclesComponent},
    { path: 'bikes', component: BikesComponent},
    { path: 'scooters', component: ScootersComponent},
    { path: 'manufacturer-add', component: AddManufacturerComponent},
    { path: 'accounts', component: AccountsComponent},
    {path: 'details', component: VehicleDetailsComponent},
    {path:'rentals',component:RentalsComponent},
    {path:'map',component:VehicleMapComponent},
    {path:'clients',component:ClientsComponent},
    {path:'malfunctions',component:MalfunctionsComponent},
    {path:'statistics',component:StatisticsComponent},
    {path:'prices',component:RentPriceComponent}
        ]},
    
    {path:"**",component:ErrorPageComponent},
];
