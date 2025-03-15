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

  vehicleMap: { [key: string]: any[] } = {};

  paginatedVehicles:any[]=[];
  vehicles:any[]=[];
  allVehicles:any[]=[];

  currentPageVehicles = 1;
  vehiclesPerPage= 6;
  totalPagesVehicles = 0;
  pagesVehicles: number[] = [];

  selectedType:string='E-Car';

  selectedRowIndex=-1;

  ngOnInit(): void {
    
    this.initialize();
  }
  private adjustImageData(type:string,data:any)
  {
    this.vehicleMap[type]=JSON.parse(JSON.stringify(data));
    let collection=this.vehicleMap[type];
      for(let element of collection)
      {
        if(!element.image.startsWith('data:')){
          element.image='data:image/png;base64,'+element.image;
          }
      }
      this.vehicleMap[type]=collection;
  }

  async initialize()
  {
    this.carsService.getCars().subscribe((data:any)=>{
      this.adjustImageData('cars',data);
      this.vehicles=JSON.parse(JSON.stringify(this.vehicleMap['cars']));

      this.updatePaginationVehicles();

    },(error)=>
    {
      alert("Error occured while reading data!");
    });

    this.bikeService.getBikes().subscribe((data:any)=>{
      this.adjustImageData('bikes',data);

    },(error)=>
    {
      alert("Error occured while reading data!");
    });


    this.scooterService.getScooters().subscribe((data:any)=>{
      this.adjustImageData('scooters',data);

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
    let type='cars';
    if(this.selectedType==='E-Bike')
    {
      type='bikes';
    }
    else if(this.selectedType==='E-Scooter')
    {
      type='scooters';
    }
    if(!query.trim() || query==='')
      {
        this.vehicles=JSON.parse(JSON.stringify(this.vehicleMap[type]));
        this.updatePaginationVehicles();
        return;
      }
      this.vehicles=this.vehicleMap[type].filter(v=>v.manufacturer.toString().toLowerCase().includes(query)||
      v.model.toString().toLowerCase().includes(query) ||
      (v.manufacturer+" "+v.model).toLowerCase().includes(query)||
      (this.selectedType==='E-Car' && v.carId.toString().toLowerCase().includes(query))||
      (this.selectedType==='E-Bike' && v.bikeId.toString().toLowerCase().includes(query)) ||
      (this.selectedType==='E-Scooter' && v.scooterId.toString().toLowerCase().includes(query))
    );
      this.updatePaginationVehicles();
  }

  changeType(event:any)
  {
      this.selectedType=event;
      this.selectedRowIndex=-1;
      this.malfunctionTable.clearTable();
      if(this.selectedType==='E-Car')
      {
        this.vehicles=this.vehicleMap['cars'];
      }
      else if(this.selectedType==='E-Bike')
      {
        this.vehicles=this.vehicleMap['bikes'];
      }
      else if(this.selectedType==='E-Scooter')
      {
        this.vehicles=this.vehicleMap['scooters'];
      }
      this.updatePaginationVehicles();
  }

  setMalfunctionsTable(vehicle:any,index:number)
  {
    this.selectedRowIndex=index;
    this.malfunctionTable.loadData(vehicle);
  }

  showAddMalfunctionTab()
  {
    this.malfunctionTable.showAddMalfunctionModal();
  }


  updatePaginationVehicles()
  {
    const collection = this.vehicles;
    this.totalPagesVehicles = Math.ceil(collection.length / this.vehiclesPerPage);
    this.pagesVehicles = Array.from({ length: this.totalPagesVehicles }, (_, i) => i + 1);
    this.paginatedVehicles = collection.slice(
      (this.currentPageVehicles - 1) * this.vehiclesPerPage,
      this.currentPageVehicles * this.vehiclesPerPage
    );
    
  }
  changePageVehicles(page: number) {
    if (page >= 1 && page <= this.totalPagesVehicles) {
      this.currentPageVehicles = page;
      this.updatePaginationVehicles();
    }
  }



}
