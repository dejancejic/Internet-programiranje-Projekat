import { AfterViewInit, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CarTabComponent } from "../tabs/car-tab/car-tab.component";
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { Car } from '../model/car';
import { CarsService } from '../services/cars/cars.service';
import { HttpClientModule } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'vehicles',
  imports: [CarTabComponent, MatButtonModule, HeaderComponent,CommonModule,HttpClientModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css',
  providers:[CarsService]
})
export class VehiclesComponent implements OnInit,AfterViewInit{

  cars:Car[]=[];
  query:string='';
  selectedVehicleIndex=-1;

  loading:boolean=true;

  modalInstance: any;

  carsService=inject(CarsService);

  @ViewChild('removeVehicleModal') removeVehicleModal: any; 

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
      this.cars.splice(this.selectedVehicleIndex,1);
      //TODO REMOVE VEHICLE SERVICE METHOD
      this.modalInstance.hide();
   
    }
    this.selectedVehicleIndex=-1;
  }

  addNewVehicle(event:any)
  {
    console.log(event);
    this.cars.push(event);
  }

}
