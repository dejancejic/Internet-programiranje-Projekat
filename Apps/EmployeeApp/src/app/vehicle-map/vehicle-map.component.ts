import { Component, inject } from '@angular/core';
import { OperatorHeaderComponent } from "../operator-header/operator-header.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RentalsService } from '../services/rentals/rentals.service';
import { ConstantsService } from '../services/utils/constants.service';

@Component({
  selector: 'app-vehicle-map',
  imports: [OperatorHeaderComponent,CommonModule,HttpClientModule],
  templateUrl: './vehicle-map.component.html',
  styleUrl: './vehicle-map.component.css',
  providers:[RentalsService,ConstantsService]
})
export class VehicleMapComponent {

  rentalsService=inject(RentalsService);
  constantsService=inject(ConstantsService);

  vehicles:any[]=[];
  loading:boolean=false;


  search(event:any)
  {


  }

  changeType(event:any)
  {

  }
}
