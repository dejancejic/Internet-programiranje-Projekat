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

    setMalfunctions(vehicle:any)
    {
      this.vehicle=vehicle;
  
      this.loadData();
      
    }


    loadData( page: number = 1,query:string=''): void {
        this.currentPageMalfunctions = page;
    
        this.vehicleService.getVehicleMalfunctions(this.vehicle.id, page - 1, this.malfunctionsPerPage,query).subscribe((response: any) => {
            this.malfunctions = response.content;
            this.malfunctionsAll=JSON.parse(JSON.stringify(response.content));
            
            this.totalPagesMalfunctions = response.totalPages;
            this.pagesMalfunctions = Array.from({ length: this.totalPagesMalfunctions }, (_, i) => i + 1);
          },
          (error) => {
            alert(error);
          }
        );
    }
    
    clearTable()
    {
      this.totalPagesMalfunctions=0;
      this.pagesMalfunctions=[];
      this.malfunctions=[];
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

   



  changePageMalfunctions(page: number) {
    if (page >= 1 && page <= this.totalPagesMalfunctions) {
      this.loadData(page);
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
        this.vehicleService.solveMalfunction(this.selectedMalfunction!.id).subscribe((data:any)=>{
          
          this.selectedMalfunction!.solved=true;
          

          this.modalInstanceRemove.hide();
          this.modalInstanceSuccess.show();
      
          for(let m of this.malfunctions){
            if(m.id===this.selectedMalfunction!.id){
          m.solved=true;
          break;
            }
          }
              if(data===false)
              {     
                this.vehicle.status='free';  
              }
                  
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

   

     },
    (error)=>{
      
      this.networkError=true;
    });
  }

  searchMalfunctions(event:any)
  {
    const query = event.target.value.toLowerCase();
    this.currentPageMalfunctions=1;


    this.loadData(this.currentPageMalfunctions, query);

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
