import { AfterViewInit, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CarTabComponent } from "../tabs/car-tab/car-tab.component";
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { Car } from '../model/car';
import { CarsService } from '../services/cars/cars.service';
import { HttpClientModule } from '@angular/common/http';
import { VehicleService } from '../services/vehicles/vehicle.service';

declare var bootstrap: any;

@Component({
  selector: 'vehicles',
  imports: [CarTabComponent, MatButtonModule, HeaderComponent,CommonModule,HttpClientModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css',
  providers:[CarsService,VehicleService]
})
export class VehiclesComponent implements OnInit,AfterViewInit{

  cars:Car[]=[];
  query:string='';
  selectedVehicleIndex=-1;

  loading:boolean=true;

  modalInstance: any;
  modalInstanceSuccess: any;

  carsService=inject(CarsService);
  vehicleService=inject(VehicleService);

  @ViewChild('removeVehicleModal') removeVehicleModal: any; 
  @ViewChild('successModal') successModal: any; 

  ngOnInit(): void {
    
   this.getCars(); 

  }

  private getCars()
  {
    this.carsService.getCars().subscribe((data:any)=>{
      this.cars=data;

  
   
     this.loading=false;
  },(error)=>{
    alert(error);
    this.loading=false;
    });
  }

  ngAfterViewInit() {
  
    const modalElement = this.removeVehicleModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalElement);

    const modalElementSuccess = this.successModal.nativeElement;
    this.modalInstanceSuccess = new bootstrap.Modal(modalElementSuccess);

  }

  search(query:string)
  {
    this.query=query;
  }

  

  showDeleteVehicleModal(index:number)
  {
    if (this.modalInstance) {
      this.selectedVehicleIndex=index;
      this.modalInstance.show();
    }
  }


  removeVehicle()
  {
    if(this.selectedVehicleIndex!==-1)
    {
      let car=this.cars[this.selectedVehicleIndex];

      this.vehicleService.deleteVehicle(car.id).subscribe((data)=>{
        this.loading=false;
        this.modalInstance.hide();
        this.modalInstanceSuccess.show();
        this.cars.splice(this.selectedVehicleIndex,1);
        this.selectedVehicleIndex=-1;
      },
    (error)=>{
      this.loading=false;
      alert(error);
      this.selectedVehicleIndex=-1;
    })

    
    }
    
  }

  addNewVehicle(event:any)
  {
    
    this.cars.push(event);
  }

}
