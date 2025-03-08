import { AfterViewInit, Component, HostListener, inject, Input, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { CarTabComponent } from "../tabs/car-tab/car-tab.component";
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { Car } from '../model/car';
import { CarsService } from '../services/cars/cars.service';
import { HttpClientModule } from '@angular/common/http';
import { VehicleService } from '../services/vehicles/vehicle.service';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

declare var bootstrap: any;

@Component({
  selector: 'vehicles',
  imports: [CarTabComponent, MatButtonModule, HeaderComponent,CommonModule,HttpClientModule,CdkVirtualScrollViewport,ScrollingModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css',
  providers:[CarsService,VehicleService]
})
export class VehiclesComponent implements OnInit,AfterViewInit{

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
    for (let i = 0; i < this.cars.length; i += this.itemsPerRow) {
      this.visibleRows.push(this.cars.slice(i, i + this.itemsPerRow));
    }
  }


  cars:Car[]=[];

  allCars:Car[]=[];

  query:string='';
  selectedId=-1;

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
      this.allCars=data;

      this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
   
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

  search(query: any) {
    this.query = query;
  
    if (!query.trim()) {
      this.cars = [...new Set(this.allCars)];
    } else {
      this.cars = this.allCars.filter(c =>
        c.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
        c.carId.toLowerCase().includes(query.toLowerCase()) ||
        c.model.toLowerCase().includes(query.toLowerCase())
      );
    }

    this.calculateItemsPerRow();
    this.formatCarsIntoRows();
    this.cdr.detectChanges();
  }
  

  showDeleteVehicleModal(id:number)
  {
    if (this.modalInstance) {
      this.selectedId=id;
      this.modalInstance.show();
    }
  }


  removeVehicle()
  {
    if(this.selectedId!==-1)
    {
      let car=null;
      let index=0;
      for(let c of this.cars){
        if(c.id===this.selectedId){
      car=c;
      break;
      }
      index++;
    }

      this.vehicleService.deleteVehicle(car!.id).subscribe((data)=>{
        this.loading=false;
        this.modalInstance.hide();
        this.modalInstanceSuccess.show();
        this.cars.splice(index,1);
        this.calculateItemsPerRow();
    this.formatCarsIntoRows();
    this.cdr.detectChanges();
        this.selectedId=-1;
      },
    (error)=>{
      this.loading=false;
      alert(error);
      this.selectedId=-1;
    });

    
    }
    
  }

  addNewVehicle(event:any)
  {
    
    this.cars.push(event);
  }

}
