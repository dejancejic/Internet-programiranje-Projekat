import { AfterViewInit, ChangeDetectorRef, Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { OperatorHeaderComponent } from "../operator-header/operator-header.component";
import { CarsService } from '../services/cars/cars.service';
import { BikeService } from '../services/bike/bike.service';
import { ScootersService } from '../services/scooters/scooters.service';
import { HttpClientModule } from '@angular/common/http';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { CarTabComponent } from "../tabs/car-tab/car-tab.component";
import { CarDetailsTabComponent } from "../tabs/car-details-tab/car-details-tab.component";
import { BikeTabComponent } from "../tabs/bike-tab/bike-tab.component";
import { ScooterTabComponent } from "../tabs/scooter-tab/scooter-tab.component";
import { UpdatePriceComponent } from "../modals/update-price/update-price.component";

@Component({
  selector: 'app-rent-price',
  imports: [CommonModule, OperatorHeaderComponent, HttpClientModule, CdkVirtualScrollViewport, ScrollingModule, CarTabComponent, BikeTabComponent, ScooterTabComponent, UpdatePriceComponent],
  templateUrl: './rent-price.component.html',
  styleUrl: './rent-price.component.css',
  providers:[CarsService,BikeService,ScootersService]
})
export class RentPriceComponent implements OnInit,AfterViewInit {

  selectedType='E-Car';
  selectedVehicle:any=null;
  vehicles:any[]=[];
  vehicleMap: { [key: string]: any[] } = {};

  @ViewChild("updatePriceModal") updatePriceModal:UpdatePriceComponent=null!;


  visibleRows: any[] = [];
    constructor(private cdr: ChangeDetectorRef){}
    itemsPerRow = 1;
    rowHeight = 150;
  
    @HostListener('window:resize')
    onResize() {
      this.calculateItemsPerRow();
      this.formatCarsIntoRows();
    }
  
    private calculateItemsPerRow() {
      const containerWidth = window.innerWidth - 50; 
      const itemWidth = 200; 
      this.itemsPerRow = Math.floor(containerWidth / itemWidth) || 1;
  
      this.rowHeight=350;
    }
  
    private formatCarsIntoRows() {
      this.visibleRows = [];
      for (let i = 0; i < this.vehicles.length; i += this.itemsPerRow) {
        this.visibleRows.push(this.vehicles.slice(i, i + this.itemsPerRow));
      }
    }

  



  carsService=inject(CarsService);
    bikeService=inject(BikeService);
    scooterService=inject(ScootersService);
    loading:boolean=false;

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
        this.adjustImageData('E-Car',data);
        this.vehicles=JSON.parse(JSON.stringify(this.vehicleMap['E-Car']));
  
        this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
      },(error)=>
      {
        alert("Error occured while reading data!");
      });
  
      this.bikeService.getBikes().subscribe((data:any)=>{
        this.adjustImageData('E-Bike',data);
  
      },(error)=>
      {
        alert("Error occured while reading data!");
      });
  
  
      this.scooterService.getScooters().subscribe((data:any)=>{
        this.adjustImageData('E-Scooter',data);
  
      },(error)=>
      {
        alert("Error occured while reading data!");
      });
  
  
  
    }

  ngAfterViewInit(): void {
    
  }


  search(event:any)
  {
    let query=event.toString().toLowerCase();
   
    if(!query.trim() || query==='')
      {
        this.vehicles=this.vehicleMap[this.selectedType];
        
        this.calculateItemsPerRow();
        this.formatCarsIntoRows();
        this.cdr.detectChanges();
        return;
      }
      this.vehicles=this.vehicleMap[this.selectedType].filter(v=>v.model.toString().toLowerCase().includes(query)||
      v.manufacturer.toString().toLowerCase().includes(query)||
      (v.model.toString().toLowerCase()+" "+v.manufacturer.toString().toLowerCase()).includes(query)||
      (this.selectedType==='E-Car' && v.carId.toString().toLowerCase().includes(query))||
      (this.selectedType==='E-Bike' && v.bikeId.toString().toLowerCase().includes(query))||
      (this.selectedType==='E-Scooter' && v.scooterId.toString().toLowerCase().includes(query))
    );
    this.calculateItemsPerRow();
    this.formatCarsIntoRows();
    this.cdr.detectChanges();
  }
  changeType(event:any)
  { 
    this.selectedType=event;

    this.vehicles=this.vehicleMap[this.selectedType];
    this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();

  }


  showUpdatePriceModal(vehicle:any)
  {
   this.selectedVehicle=vehicle;

    this.updatePriceModal.showModal();


  }

}
