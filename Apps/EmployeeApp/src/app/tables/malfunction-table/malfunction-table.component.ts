import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Malfunction } from '../../model/malfunction';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { futureDateValidator } from '../../services/validators/dateValidator';
import { HttpClientModule } from '@angular/common/http';
import { DurationService } from '../../services/utils/duration.service';
import { VehicleService } from '../../services/vehicles/vehicle.service';

declare var bootstrap:any;
@Component({
  selector: 'malfunction-table',
  imports: [CommonModule,HttpClientModule,FormsModule,ReactiveFormsModule],
  templateUrl: './malfunction-table.component.html',
  styleUrl: './malfunction-table.component.css',
  providers:[VehicleService,DurationService]
})
export class MalfunctionTableComponent implements AfterViewInit {

  @Input() showSearchBar:boolean=false;
  @Input() showDeleteMalfunctionBtn:boolean=true;


  vehicleService=inject(VehicleService);
  durationService=inject(DurationService);

  malfunctions:Malfunction[]=[];
  malfunctionsAll:Malfunction[]=[];

  paginatedMalfunctions: any[] = [];
  currentPageMalfunctions = 1;
  malfunctionsPerPage = 6;
  totalPagesMalfunctions = 0;
  pagesMalfunctions: number[] = [];

  selectedMalfunction:Malfunction|null=null;

  selectedDescription: string | null = null;
  tooltipPosition = { top: 0, left: 0 };

  add=false;
  networkError:boolean=false;
  vehicle:any;


     modalInstance: any;
    @ViewChild('addMalfunctionModal') addMalfunctionModal: any; 
    modalInstanceRemove: any;
    @ViewChild('removeMalfunctionModal') removeMalfunctionModal: any; 
    modalInstanceSuccess: any;
    @ViewChild('successModal') successModal: any; 

    modalInstanceDescription: any;
    @ViewChild('descriptionModal') descriptionModal: any;


  formBuilder=inject(FormBuilder);
    selectedForm:FormGroup=this.formBuilder.group({
      id:[null],
      description:[null,Validators.required],
      dateTime:[null,[Validators.required, futureDateValidator()]],
      vehicleId:[null],
      solved:[false]
    });

    setMalfunctions(malfunctions:Malfunction[],vehicle:any)
    {
      this.vehicle=vehicle;
      this.malfunctionsAll=malfunctions;
      this.malfunctions = JSON.parse(JSON.stringify(this.malfunctionsAll));
      this.updatePaginationMalfunctions();
    }


    loadData(vehicle:any): void {
      if(vehicle.id!=0)
      {
        this.vehicle=vehicle;
        this.vehicleService.getVehicleMalfunctions(vehicle.id).subscribe((data:any)=>{
          this.malfunctionsAll = JSON.parse(JSON.stringify(data));
      this.malfunctions = JSON.parse(JSON.stringify(data));
          
          this.updatePaginationMalfunctions();
        },(error)=>{
          alert("Error loading data!");
        }
        );
      }
    }
    clearTable()
    {
      this.malfunctions=[];
      this.malfunctionsAll=[];
      this.updatePaginationMalfunctions();
    }

    ngAfterViewInit(): void {
      const modalElement = this.addMalfunctionModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalElement);

    const modalElementRemove = this.removeMalfunctionModal.nativeElement;
    this.modalInstanceRemove = new bootstrap.Modal(modalElementRemove);

    const modalElementSuccess = this.successModal.nativeElement;
    this.modalInstanceSuccess = new bootstrap.Modal(modalElementSuccess);

    const modalElementDescription = this.descriptionModal.nativeElement;
    this.modalInstanceDescription = new bootstrap.Modal(modalElementDescription);

    }
    calculateDuration(start: Date, end: Date): string {
   
      return this.durationService.calculateDuration(start,end);
    }

    updatePaginationMalfunctions()
  {
    const collection = this.malfunctions;
    this.totalPagesMalfunctions = Math.ceil(collection.length / this.malfunctionsPerPage);
    this.pagesMalfunctions = Array.from({ length: this.totalPagesMalfunctions }, (_, i) => i + 1);
    this.paginatedMalfunctions = collection.slice(
      (this.currentPageMalfunctions - 1) * this.malfunctionsPerPage,
      this.currentPageMalfunctions * this.malfunctionsPerPage
    );
  }

  changePageMalfunctions(page: number) {
    if (page >= 1 && page <= this.totalPagesMalfunctions) {
      this.currentPageMalfunctions = page;
      this.updatePaginationMalfunctions();
    }
  }

  showAddMalfunctionModal()
  {
    this.modalInstance.show();
  }

  deleteMalfunction(malfunction:Malfunction)
  {
      this.selectedMalfunction=malfunction;
    this.add=false;
    this.modalInstanceRemove.show();
  }


  showDescription(event: MouseEvent, malfunction:Malfunction) {

    this.selectedMalfunction=malfunction;
    this.modalInstanceDescription.show();
    
  }

  solveMalfunctionToSystem()
  {
    if(this.selectedMalfunction!==null)
    {
        this.vehicleService.solveMalfunction(this.selectedMalfunction!.id).subscribe((data)=>{
          
          this.selectedMalfunction!.solved=true;
          

          this.modalInstanceRemove.hide();
          this.modalInstanceSuccess.show();
          let found=false;

          for(let m of this.malfunctionsAll)
            {
              if(m.id===this.selectedMalfunction!.id)
              {
                m.solved=true;
              }
              if(m.solved===false)
              {
                found=true;
                break;
              }
            }
            if(found==false)
            {
              this.vehicle.status='free';
            }
      
          this.updatePaginationMalfunctions();
        },(error)=>{
          this.networkError=true;
        });
    }
  }


  addMalfunctionToSystem()
  {
     let mal=this.selectedForm.value as Malfunction;
     mal.vehicleId=this.vehicle.id;
    this.add=true;
     this.vehicleService.addMalfunction(mal).subscribe((data:any)=>{

      this.malfunctionsAll.push(data);
      this.malfunctions.push(data);
      this.vehicle.status='broken';
      this.closeModal();
    this.modalInstance.hide();
    this.modalInstanceSuccess.show();
      this.updatePaginationMalfunctions();
     },
    (error)=>{
      
      this.networkError=true;
    });
  }

  searchMalfunctions(event:any)
  {
    const query = event.target.value.toLowerCase();

    if(!query.trim() || query==='')
    {
      this.malfunctions = JSON.parse(JSON.stringify(this.malfunctionsAll));
      this.updatePaginationMalfunctions();
      return;
    }
    this.malfunctions=this.malfunctionsAll.filter(m=>m.dateTime.toString().toLowerCase().includes(query));
    this.updatePaginationMalfunctions();
  }



  closeModalRemove()
  {
    this.closeModal();
    this.modalInstanceRemove.hide();
  }

  dismiss() {
    this.networkError = false;
  }

  selectAdd()
  {
    this.add=true;
  }

  closeModal()
  {
    this.selectedForm.reset();
    this.networkError=false;
  }

}
