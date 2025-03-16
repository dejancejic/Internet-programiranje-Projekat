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
    itemsPerRow = 1;
    rowHeight = 150;

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

  query='';

  manufacturerMap: { [key: string]: Manufacturer[] } = {};

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
    
    this.getManufacturers();

  }

  private getManufacturers()
  {
  
    this.manufacturerService.getManufacturers().subscribe((data:any)=>{
      this.manufacturerMap=data;
      this.manufacturers = JSON.parse(JSON.stringify(data[this.selectedVehicleType]));

      this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
     this.loading=false;
  },(error)=>{
    alert(error);
    this.loading=false;
    });

  }
  

  search(query: any) {
    this.query=query;
    if (!query.trim()) {
  
      this.manufacturers=this.manufacturerMap[this.selectedVehicleType];
      this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
      return;
    }
  

    this.manufacturers = this.manufacturerMap[this.selectedVehicleType].filter(m =>
      m.name.toLowerCase().includes(query.toLowerCase())
    );
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
    
    this.manufacturers=this.manufacturerMap[type];
    this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
  }


  addManufacturer(manufacturer:any)
  {
      this.manufacturers.push(manufacturer);
    this.manufacturerMap[this.selectedVehicleType]=this.manufacturers;

    this.calculateItemsPerRow();
      this.formatCarsIntoRows();
      this.cdr.detectChanges();
  }

  updateManufacturer(manufacturer:any)
  {}


  dismiss()
  {
    
  }


}
