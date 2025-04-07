import { AfterViewInit, ChangeDetectorRef, Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Bike } from '../model/bike';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { VehicleService } from '../services/vehicles/vehicle.service';
import { Vehicle } from '../model/vehicle';
import { BikeTabComponent } from "../tabs/bike-tab/bike-tab.component";
import { BikeService } from '../services/bike/bike.service';
import { ConstantsService } from '../services/utils/constants.service';

declare var bootstrap: any;

@Component({
  selector: 'app-bikes',
  imports: [HeaderComponent, HttpClientModule, CommonModule, CdkVirtualScrollViewport, ScrollingModule, BikeTabComponent],
  templateUrl: './bikes.component.html',
  styleUrl: './bikes.component.css',
  providers:[VehicleService,BikeService]
})
export class BikesComponent implements OnInit,AfterViewInit {

  bikes:Bike[]=[];
  allBikes:Bike[]=[];


  query:string='';

  vehicleService=inject(VehicleService);

  bikeService=inject(BikeService);

  visibleRows: any[] = [];
    constructor(private cdr: ChangeDetectorRef){}
    itemsPerRow = 6;
      rowHeight = 150;
      bikesPerPage = inject(ConstantsService).PAGINATION_NUMBER;
      currentPageBikes = 1;
      totalPagesBikes = 0;
      
      pagesBikes: number[] = [];
      endReached = false;


      @ViewChild('removeVehicleModal') removeVehicleModal: any; 
      @ViewChild('successModal') successModal: any; 

  modalInstance: any;
  modalInstanceSuccess: any;

  selectedId=-1;
  loading:boolean=true;
  error:boolean=false;


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
        for (let i = 0; i < this.bikes.length; i += this.itemsPerRow) {
          this.visibleRows.push(this.bikes.slice(i, i + this.itemsPerRow));
        }
      }

      ngOnInit(): void {
    
        this.loadData();
       }
     
       loadData(page: number = this.currentPageBikes, query: string = '') {
         this.loading = true;
         
         this.bikeService.getBikes(page - 1, this.itemsPerRow, query).subscribe((data: any) => {
           const newBikes = data.content;
           this.totalPagesBikes = data.totalPages;
       
           if (newBikes.length === 0 || page >= this.totalPagesBikes) {
             this.endReached = true;
           }
           
     
           this.allBikes = [...this.allBikes, ...newBikes];
           this.bikes=JSON.parse(JSON.stringify(this.allBikes));
           this.visibleRows = this.chunkArray(this.allBikes, this.itemsPerRow);
       
           this.currentPageBikes++; 
           this.loading = false;
         }, (error) => {
           alert("Error occurred while reading data!");
           this.loading = false;
         });
       }

      ngAfterViewInit(): void {
        
        const modalElement = this.removeVehicleModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalElement);

    const modalElementSuccess = this.successModal.nativeElement;
    this.modalInstanceSuccess = new bootstrap.Modal(modalElementSuccess);
      }




      search(query: any) {
        this.query = query;
      
        if (!query.trim()) {
          this.bikes = [...new Set(this.allBikes)];
        } else {
          this.bikes = this.allBikes.filter(c =>
            c.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
            c.bikeId.toLowerCase().includes(query.toLowerCase()) ||
            c.model.toLowerCase().includes(query.toLowerCase())
          );
        }
    
        this.calculateItemsPerRow();
        this.formatCarsIntoRows();
        this.cdr.detectChanges();
      }

      addNewVehicle(event:any)
      {
        this.bikes.push(event);
        this.calculateItemsPerRow();
        this.formatCarsIntoRows();
        this.cdr.detectChanges();
      }

  removeVehicle()
  {
    if(this.selectedId!==-1)
      {
        let bike=null;
        let index=0;
        for(let b of this.bikes){
          if(b.id===this.selectedId){
        bike=b;
        break;
        }
        index++;
      }

      this.vehicleService.deleteVehicle(bike!.id).subscribe((data)=>{
        this.loading=false;
        this.modalInstance.hide();
        this.modalInstanceSuccess.show();
        this.bikes.splice(index,1);
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

  showDeleteVehicleModal(id:number)
  {
    if (this.modalInstance) {
      this.selectedId=id;
      this.modalInstance.show();
    }
  }

  dismiss()
  {
    this.error=false;
  }

  onScroll(index: number) {
    const buffer = this.bikesPerPage;
    const totalItems = this.visibleRows.length;
  
    if (!this.loading && !this.endReached && index + buffer >= totalItems) {
      this.loadData(this.currentPageBikes);
    }
  }

  chunkArray(arr: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

}
