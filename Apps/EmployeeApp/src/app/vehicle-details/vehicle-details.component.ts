import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from '../services/vehicles/vehicle.service';
import { Vehicle } from '../model/vehicle';
import { Car } from '../model/car';
import { Bike } from '../model/bike';
import { Scooter } from '../model/scooter';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-details',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,HttpClientModule],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css',
  providers:[VehicleService]
})
export class VehicleDetailsComponent implements OnInit,AfterViewInit{


  router:Router=inject(Router);
  vehicleService=inject(VehicleService);


  vehicleType='';
  vehicle:any=null!;
  error:boolean=false;

  loading:boolean=false;

  vehicleId=0;

  route=inject(ActivatedRoute);


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.vehicleType = params['type'];
      this.vehicleId=parseInt(params['id']);
      this.initialize();
    });
    this.initialize();
  }

  onImageError(event:any){
    if(this.vehicleType==='scooter'){
    event.target.src = './assets/defaultScooter.jpg';
    }
    else if(this.vehicleType==='bike')
    {
      event.target.src = './assets/defaultBike.jpg';
    }
    else if(this.vehicleType==='car')
    {
      event.target.src = './assets/defaultCar.png';
    }
  }

  ngAfterViewInit(): void {
    
  }


  async initialize()
  {
    this.vehicleService.getVehicleById(this.vehicleId).subscribe((data:any)=>{
      this.vehicle=data;
      if(!this.vehicle.image.startsWith('data:')){
        this.vehicle.image='data:image/png;base64,'+this.vehicle.image;
        }
    },(error)=>{
      this.loading=false;
      this.error=true;
    }
    );
  }

}
