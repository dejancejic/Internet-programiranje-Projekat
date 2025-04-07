import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HeaderManufacturerComponent } from "../header-manufacturer/header-manufacturer.component";
import { CommonModule } from '@angular/common';
import { Manufacturer } from '../model/manufacturer';
import { ManufacturerTabComponent } from "../tabs/manufacturer-tab/manufacturer-tab.component";
import { AuthService } from '../services/utils/auth.service';
import { LogoutService } from '../services/logout/logout.service';
import { ManufacturerService } from '../services/manufacturers/manufacturer.service';
import { HttpClientModule } from '@angular/common/http';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ConstantsService } from '../services/utils/constants.service';



declare var bootstrap: any;

@Component({
  selector: 'app-add-manufacturer',
  imports: [HeaderManufacturerComponent, CommonModule, ManufacturerTabComponent,HttpClientModule,CdkVirtualScrollViewport,ScrollingModule],
  templateUrl: './add-manufacturer.component.html',
  styleUrl: './add-manufacturer.component.css',
  providers:[ManufacturerService]
})
export class AddManufacturerComponent implements AfterViewInit,OnInit{

  visibleRows: any[] = [];
    constructor(private cdr: ChangeDetectorRef){}
    itemsPerRow = 6;
    rowHeight = 150;
    manufacturersPerPage = inject(ConstantsService).PAGINATION_NUMBER;
    currentPageManufacturers = 1;
    totalPagesManufacturers = 0;
          
    pagesManufacturers: number[] = [];
    endReached = false;

    error:boolean=false;
    
  
    @HostListener('window:resize')
    onResize() {
      this.calculateItemsPerRow();
      this.formatCarsIntoRows();
    }
  
    private calculateItemsPerRow() {
      const containerWidth = window.innerWidth - 50; 
      const itemWidth = 180; 
      this.itemsPerRow = Math.floor(containerWidth / itemWidth) || 1;
  
      this.rowHeight=290;
    }
  
    private formatCarsIntoRows() {
      this.visibleRows = [];
      for (let i = 0; i < this.manufacturers.length; i += this.itemsPerRow) {
        this.visibleRows.push(this.manufacturers.slice(i, i + this.itemsPerRow));
      }
    }

  manufacturers:Manufacturer[]=[];
  allManufacturers:Manufacturer[]=[];

  query='';

  manufacturerMap: { [key: string]: any } = {};

  manufacturerService=inject(ManufacturerService);
  authService=inject(AuthService);
  logoutService=inject(LogoutService);
  
  
selectedManufacturer!:Manufacturer;


  loading:boolean=true;


  selectedVehicleType='E-Car';



  modalInstance: any;
  @ViewChild('removeManufacturerModal') removeVehicleModal: any; 

  modalInstanceSuccess: any;
  @ViewChild('successModal') successModal: any; 



  ngAfterViewInit(): void {
    const modalElement = this.removeVehicleModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalElement);

    const modalElement1 = this.successModal.nativeElement;
    this.modalInstanceSuccess = new bootstrap.Modal(modalElement1);
  }


  ngOnInit(): void {
    if(this.authService.isLoggedIn()==false)
    {
      return;
    }
    
    //this.getManufacturers();
    this.loadData();
  }


  loadData(page: number = this.currentPageManufacturers, query: string = '') {
    this.loading = true;
    
    this.manufacturerService.getManufacturers(page - 1, this.itemsPerRow, query).subscribe((data: any) => {

      this.manufacturerMap=data;
      const newManus = this.manufacturerMap[this.selectedVehicleType].content;

      this.totalPagesManufacturers = data.totalPages;
  
      if (newManus.length === 0 || page >= this.totalPagesManufacturers) {
        this.endReached = true;
      }
      

      this.allManufacturers = [...this.allManufacturers, ...newManus];
      this.manufacturers=JSON.parse(JSON.stringify(this.allManufacturers));
      this.visibleRows = this.chunkArray(this.allManufacturers, this.itemsPerRow);
      
      this.currentPageManufacturers++; 
      this.loading = false;
    }, (error) => {
      alert("Error occurred while reading data!");
      this.loading = false;
    });
  }


  

  search(query: any) {
    this.query=query;
    this.currentPageManufacturers=1;
    this.endReached=false;
    this.pagesManufacturers=[];
    this.manufacturers=[];
    this.allManufacturers=[];
    this.totalPagesManufacturers=0;
    this.loadData(this.currentPageManufacturers,query);
    this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
  }
  
  showDeleteVehicleModal(manu:Manufacturer)
  {
    if (this.modalInstance) {
      this.selectedManufacturer=manu;
      this.modalInstance.show();
    }
  }


  removeManufacturer()
  {
   
    if(this.selectedManufacturer!==undefined && this.selectedManufacturer!=null)
    {
      var index=this.manufacturers.indexOf(this.selectedManufacturer);

      this.manufacturerService.deleteManufacturer(this.selectedManufacturer.id).subscribe((data:any)=>{

      this.manufacturers.splice(index,1);
      this.manufacturerMap[this.selectedVehicleType]=this.manufacturers;
      this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
      this.modalInstance.hide();
      this.modalInstanceSuccess.show();

      },(error)=>{
        error=true;
        this.modalInstanceSuccess.show();
        });
      
   
    }
    this.selectedManufacturer=null!;
  }


  changeType(type:string)
  {
    this.selectedVehicleType=type;
    this.currentPageManufacturers=1;
    this.endReached=false;
    this.pagesManufacturers=[];
    this.manufacturers=[];
    this.allManufacturers=[];
    this.totalPagesManufacturers=0;

    this.loadData(this.currentPageManufacturers)
    this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
  }


  addManufacturer(manufacturer:any)
  {
    this.currentPageManufacturers=1;
    this.endReached=false;
    this.pagesManufacturers=[];
    this.manufacturers=[];
    this.allManufacturers=[];
    this.totalPagesManufacturers=0;
      this.loadData(this.currentPageManufacturers,this.query);

    this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
  }

  updateManufacturer(manufacturer:any)
  {}


  dismiss()
  {
    
  }


  onScroll(index: number) {
    const buffer = this.manufacturersPerPage;
    const totalItems = this.visibleRows.length;
  
    if (!this.loading && !this.endReached && index + buffer >= totalItems) {
      this.loadData(this.currentPageManufacturers);
    }
  }

  chunkArray(arr: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }


}
