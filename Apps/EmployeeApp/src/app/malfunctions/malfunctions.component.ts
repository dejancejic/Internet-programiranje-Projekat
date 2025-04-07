import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { VehicleService } from '../services/vehicles/vehicle.service';
import { OperatorHeaderComponent } from "../operator-header/operator-header.component";
import { Vehicle } from '../model/vehicle';
import { CarsService } from '../services/cars/cars.service';
import { BikeService } from '../services/bike/bike.service';
import { ScootersService } from '../services/scooters/scooters.service';
import { Scooter } from '../model/scooter';
import { MalfunctionTableComponent } from "../tables/malfunction-table/malfunction-table.component";
import { ConstantsService } from '../services/utils/constants.service';

@Component({
  selector: 'app-malfunctions',
  imports: [CommonModule, HttpClientModule, OperatorHeaderComponent, MalfunctionTableComponent],
  templateUrl: './malfunctions.component.html',
  styleUrl: './malfunctions.component.css',
  providers:[CarsService,BikeService,ScootersService]
})
export class MalfunctionsComponent implements OnInit {

  carsService=inject(CarsService);
  bikeService=inject(BikeService);
  scooterService=inject(ScootersService);
  loading:boolean=false;

  @ViewChild("malfunctionTable") malfunctionTable: any;

  vehicles:any[]=[];
  

  currentPageVehicles = 1;
  vehiclesPerPage=  inject(ConstantsService).PAGINATION_NUMBER;
  totalPagesVehicles = 0;
  pagesVehicles: number[] = [];

  selectedType:string='E-Car';

  selectedRowIndex=-1;

  ngOnInit(): void {
    
    this.loadDataCars();
  }
  private adjustImageData(data:any)
  {
    let collection=data.content;

      for(let element of collection)
      {
        if(!element.image.startsWith('data:')){
          element.image='data:image/png;base64,'+element.image;
          }
      }
      this.vehicles=collection;
  }

  loadDataBikes(page:number=1,query:string='')
  {
    this.bikeService.getBikes(page - 1, this.vehiclesPerPage,query).subscribe((data:any)=>{
      this.adjustImageData(data);

      this.totalPagesVehicles = data.totalPages;
    this.pagesVehicles= Array.from({ length: this.totalPagesVehicles }, (_, i) => i + 1);

    },(error)=>
    {
      alert("Error occured while reading data!");
    });
  }

  loadDataScooters(page:number=1,query:string='')
  {
    this.scooterService.getScooters(page - 1, this.vehiclesPerPage,query).subscribe((data:any)=>{
      this.adjustImageData(data);
      this.totalPagesVehicles = data.totalPages;
    this.pagesVehicles= Array.from({ length: this.totalPagesVehicles }, (_, i) => i + 1);

    },(error)=>
    {
      alert("Error occured while reading data!");
    });
  }

  loadDataCars(page: number = 1,query:string='')
  {
    this.carsService.getCars(page - 1, this.vehiclesPerPage,query).subscribe((data:any)=>{
      this.adjustImageData(data);

      this.totalPagesVehicles = data.totalPages;
    this.pagesVehicles= Array.from({ length: this.totalPagesVehicles }, (_, i) => i + 1);

    },(error)=>
    {
      alert("Error occured while reading data!");
    });
  }



  search(event:any)
  {
    const query = event.toLowerCase();
    this.selectedRowIndex=-1;
    this.malfunctionTable.clearTable();
    
    this.currentPageVehicles=1;
    if(this.selectedType==='E-Car'){
      this.loadDataCars(this.currentPageVehicles,query);
    }
    if(this.selectedType==='E-Bike')
    {
      this.loadDataBikes(this.currentPageVehicles,query);
    }
    else if(this.selectedType==='E-Scooter')
    {
      this.loadDataScooters(this.currentPageVehicles,query);
    }
   
  }

  changeType(event:any)
  {
      this.selectedType=event;
      this.selectedRowIndex=-1;
      this.malfunctionTable.clearTable();
      this.currentPageVehicles=1;
    if(this.selectedType==='E-Car'){
      this.loadDataCars();
    }
    if(this.selectedType==='E-Bike')
    {
      this.loadDataBikes();
    }
    else if(this.selectedType==='E-Scooter')
    {
      this.loadDataScooters();
    }
  }

  setMalfunctionsTable(vehicle:any,index:number)
  {
    this.selectedRowIndex=index;
    this.malfunctionTable.setMalfunctions(vehicle);
  }

  showAddMalfunctionTab()
  {
    this.malfunctionTable.showAddMalfunctionModal();
  }


  changePageVehicles(page: number) {
    if (page >= 1 && page <= this.totalPagesVehicles) {
      if(this.selectedType==='E-Car'){
        this.loadDataCars(page);
      }
      if(this.selectedType==='E-Bike')
      {
        this.loadDataBikes(page);
      }
      else if(this.selectedType==='E-Scooter')
      {
        this.loadDataScooters(page);
      }
    }
  }



}
