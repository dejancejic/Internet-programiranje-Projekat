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
import { ConstantsService } from '../services/utils/constants.service';
import { ErrorComponent } from "../modals/error/error.component";

@Component({
  selector: 'app-rent-price',
  imports: [CommonModule, OperatorHeaderComponent, HttpClientModule, CdkVirtualScrollViewport, ScrollingModule, CarTabComponent, BikeTabComponent, ScooterTabComponent, UpdatePriceComponent, ErrorComponent],
  templateUrl: './rent-price.component.html',
  styleUrl: './rent-price.component.css',
  providers:[CarsService,BikeService,ScootersService]
})
export class RentPriceComponent implements OnInit,AfterViewInit {

  selectedType='E-Car';
  selectedVehicle:any=null;
  vehicles:any[]=[];
  allVehicles:any[]=[];

  @ViewChild("updatePriceModal") updatePriceModal:UpdatePriceComponent=null!;


  visibleRows: any[] = [];
    constructor(private cdr: ChangeDetectorRef){}
    itemsPerRow = 6;
    rowHeight = 150;
    vehiclesPerPage = inject(ConstantsService).PAGINATION_NUMBER;
    currentPageVehicles = 1;
    totalPagesVehicles = 0;      
    pagesVehicles: number[] = [];
    endReached = false;

    @ViewChild("errorModal") errorModal:any;

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
    
      this.loadDataCars();
    }
    private adjustImageData(data:any)
    {
        for(let element of data)
        {
          if(!element.image.startsWith('data:')){
            element.image='data:image/png;base64,'+element.image;
            }
        }
    }



    loadDataBikes(page: number = this.currentPageVehicles, query: string = '') {
      this.loading = true;
      
      this.bikeService.getBikes(page - 1, this.itemsPerRow, query).subscribe((data: any) => {
        this.assignData(page,data);
      }, (error) => {
        let msg=error.message;
        if(msg.includes("Progress")){
          msg="Server failed to respond!";
        }
        this.errorModal.showModal('Failed to load bikes',msg);
        this.loading = false;
      });
    }
    loadDataCars(page: number = this.currentPageVehicles, query: string = '') {
      this.loading = true;
      
      this.carsService.getCars(page - 1, this.itemsPerRow, query).subscribe((data: any) => {
        this.assignData(page,data);
      }, (error) => {
        let msg=error.message;
        if(msg.includes("Progress")){
          msg="Server failed to respond!";
        }
        this.errorModal.showModal('Failed to load cars',msg);
        this.loading = false;
      });
    }
    loadDataScooters(page: number = this.currentPageVehicles, query: string = '') {
      this.loading = true;
      
      this.scooterService.getScooters(page - 1, this.itemsPerRow, query).subscribe((data: any) => {
        this.assignData(page,data);
      }, (error) => {
        let msg=error.message;
        if(msg.includes("Progress")){
          msg="Server failed to respond!";
        }
        this.errorModal.showModal('Failed to load scooters',msg);
        this.loading = false;
      });
    }

    private assignData(page:number,data:any)
    {
      this.adjustImageData(data.content);
      const newVehicles = data.content;
        this.totalPagesVehicles = data.totalPages;
    
        if (newVehicles.length === 0 || page >= this.totalPagesVehicles) {
          this.endReached = true;
        }
        
  
        this.allVehicles = [...this.allVehicles, ...newVehicles];
        this.vehicles=JSON.parse(JSON.stringify(this.allVehicles));
        this.visibleRows = this.chunkArray(this.allVehicles, this.itemsPerRow);
    
        this.currentPageVehicles++; 
        this.loading = false;
    }



  ngAfterViewInit(): void {
    
  }


  search(event:any)
  {
    let query=event.toString().toLowerCase();
   
    if(!query.trim() || query==='')
      {
        this.vehicles=JSON.parse(JSON.stringify(this.allVehicles));
        
        this.calculateItemsPerRow();
        this.formatCarsIntoRows();
        this.cdr.detectChanges();
        return;
      }
      this.vehicles=this.allVehicles.filter(v=>v.model.toString().toLowerCase().includes(query)||
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
    this.vehicles=[];
    this.allVehicles=[];
    this.visibleRows = [];
    this.currentPageVehicles=1;
    this.totalPagesVehicles=0;
    this.endReached=false;
    if(this.selectedType==='E-Car'){
      this.loadDataCars(this.currentPageVehicles);
      }
      else if(this.selectedType==='E-Bike'){
        this.loadDataBikes(this.currentPageVehicles);
        }
        else if(this.selectedType==='E-Scooter'){
          this.loadDataScooters(this.currentPageVehicles);
          }
    
    this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();

  }


  showUpdatePriceModal(vehicle:any)
  {
   this.selectedVehicle=vehicle;

    this.updatePriceModal.showModal();


  }

  onScroll(index: number) {
    const buffer = this.vehiclesPerPage;
    const totalItems = this.visibleRows.length;
  
    if (!this.loading && !this.endReached && index + buffer >= totalItems) {

      
      if(this.selectedType==='E-Car'){
      this.loadDataCars(this.currentPageVehicles);
      }
      else if(this.selectedType==='E-Bike'){
        this.loadDataBikes(this.currentPageVehicles);
        }
        else if(this.selectedType==='E-Scooter'){
          this.loadDataScooters(this.currentPageVehicles);
          }
    }
  }

  chunkArray(arr: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

}
