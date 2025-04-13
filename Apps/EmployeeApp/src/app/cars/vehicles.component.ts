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
import { ConstantsService } from '../services/utils/constants.service';
import { ErrorComponent } from "../modals/error/error.component";

declare var bootstrap: any;

@Component({
  selector: 'vehicles',
  imports: [CarTabComponent, MatButtonModule, HeaderComponent, CommonModule, HttpClientModule, CdkVirtualScrollViewport, ScrollingModule, ErrorComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css',
  providers:[CarsService,VehicleService]
})
export class VehiclesComponent implements OnInit,AfterViewInit{

  visibleRows: any[] = [];
  constructor(private cdr: ChangeDetectorRef){}
  itemsPerRow = 6;
  rowHeight = 150;
  carsPerPage = inject(ConstantsService).PAGINATION_NUMBER;
  currentPageCars = 1;
  totalPagesCars = 0;
  
  pagesCars: number[] = [];
  endReached = false;

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
  error:boolean=false;

  modalInstance: any;
  modalInstanceSuccess: any;

  carsService=inject(CarsService);
  vehicleService=inject(VehicleService);

  @ViewChild("errorModal") errorModal:any;

  @ViewChild('removeVehicleModal') removeVehicleModal: any; 
  @ViewChild('successModal') successModal: any; 

  ngOnInit(): void {
    
   this.loadData();
  }

  loadData(page: number = this.currentPageCars, query: string = '') {
    this.loading = true;
    
    this.carsService.getCars(page - 1, this.itemsPerRow, query).subscribe((data: any) => {
      const newCars = data.content;
      this.totalPagesCars = data.totalPages;
  
      if (newCars.length === 0 || page >= this.totalPagesCars) {
        this.endReached = true;
      }
      

      this.allCars = [...this.allCars, ...newCars];
      this.cars=JSON.parse(JSON.stringify(this.allCars));
      this.visibleRows = this.chunkArray(this.allCars, this.itemsPerRow);
  
      this.currentPageCars++; 
      this.loading = false;
    }, (error) => {
      let msg=error.message;
      if(msg.includes("Progress")){
        msg="Server failed to respond!";
      }
      this.errorModal.showModal('Failed to load cars',msg);
      this.loading = false;
    });
  }
  

  chunkArray(arr: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
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
      let msg=error.message;
      if(msg.includes("Progress")){
        msg="Server failed to respond!";
      }
      this.errorModal.showModal('Failed to remove vehicle',msg);
      this.selectedId=-1;
    });

    
    }
    
  }

  addNewVehicle(event:any)
  {
    this.cars.push(event);
    this.calculateItemsPerRow();
    this.formatCarsIntoRows();
  }

  dismiss()
  {
    this.error=false;
  }


  onScroll(index: number) {
    const buffer = this.carsPerPage;
    const totalItems = this.visibleRows.length;
  
    if (!this.loading && !this.endReached && index + buffer >= totalItems) {
      this.loadData(this.currentPageCars);
    }
  }

}
