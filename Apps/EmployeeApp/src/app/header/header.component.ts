import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Manufacturer } from '../model/manufacturer';
import { ManufacturerService } from '../services/manufacturers/manufacturer.service';
import { CarsService } from '../services/cars/cars.service';
import { Vehicle } from '../model/vehicle';

declare var bootstrap: any;

@Component({
  selector: 'vehicles-header',
  imports: [CommonModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[ManufacturerService,CarsService]
})
export class HeaderComponent implements AfterViewInit,OnInit{
  @Input() type: string = 'cars';
  @Input() count: number = 0;
  accountName: string = '';
  @Output() queryChanged=new EventEmitter<string>();
  @Output() addedVehicle=new EventEmitter<any>();
  
  query:string='';

  @ViewChild('addVehicleCSVModal') addVehicleCSVModal: any; 
  @ViewChild('addVehicleModal') addVehicleModal: any; 
  @ViewChild('successModal') successModal: any; 

  selectedFileName: string = '';
  selectedImageName: string = '';

  selectedImageContent:string='';
  selectedCSVContent:string='';



  fileError: boolean = false;
  networkError: boolean = false;
  imageError=false;
  sameIdError=false;
  modalInstanceCSV: any;
  modalInstanceAdd: any;
  modalInstanceSuccess:any;



  manufacturers:Manufacturer[]=[];
  manufacturerService=inject(ManufacturerService);
  carsService=inject(CarsService);

  private getManufacturers()
  {
    this.manufacturerService.getManufacturers().subscribe((data:any)=>{
    
      if(this.type==='cars')
      {
        this.manufacturers = [...this.manufacturers,...data['Car']];
      }
      else if(this.type==='bikes')
      {
        this.manufacturers = [...this.manufacturers,...data['E-Bike']];
      }
      else
      {
        this.manufacturers = [...this.manufacturers,...data['E-Scooter']];
      }
 
     
  },(error)=>{
    
    });
  }


  formBuilder=inject(FormBuilder);
  
    selectedForm:FormGroup=this.formBuilder.group({
      carId:[null,Validators.required],
      manufacturerId:[null,Validators.required],
      model:[null,Validators.required],
      price:[null,[
        Validators.required,
        Validators.min(2.99),
        Validators.max(1999.99),
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$') // Allows numbers with optional decimal places (max 2)
      ]],
      description:[null],
    });


  
  ngOnInit(): void {
    
    if(sessionStorage.getItem("account")!==null)
      {
        this.accountName=sessionStorage.getItem("account")!;
      }
      this.getManufacturers();
  }

  ngAfterViewInit() {
  
    const modalElementAdd = this.addVehicleModal.nativeElement;
    this.modalInstanceAdd = new bootstrap.Modal(modalElementAdd);

    const modalElementCSV = this.addVehicleCSVModal.nativeElement;
    this.modalInstanceCSV = new bootstrap.Modal(modalElementCSV);


    const modalElementSuccess = this.successModal.nativeElement;
    this.modalInstanceSuccess = new bootstrap.Modal(modalElementSuccess);
  }

  dismiss() {
    this.fileError = false;
    this.networkError = false;
    this.imageError=false;
    this.sameIdError=false;
  }

  addVehicleToSystem()
  {

    let car=this.selectedForm.value;
    if(this.selectedImageContent===''){
      this.imageError=true;
      return;
    }else{
    car.image=this.selectedImageContent;
    }
    console.log(car);
    this.carsService.addCar(car).subscribe((data:any)=>{

      this.addedVehicle.emit(data);

    this.modalInstanceAdd.hide();

    this.modalInstanceSuccess.show();

    this.selectedForm.reset();


    },(error:any)=>{
      if(error.toString().includes('same car'))
      {
        this.sameIdError=true;
      }
      else{
      this.networkError=true;
      }
    });

    

  }

  closeModal()
  {
    this.selectedForm.reset();
  }

  addVehicle() {
    if (this.selectedFileName.length == 0) {
      this.fileError = true;
    } else {
      
      if (this.modalInstanceAdd) {
        this.modalInstanceAdd.hide(); 
      }

      this.removeCSV();
      this.fileError = false;
    }
  }

  removeCSV() {
    this.selectedFileName = '';
    const fileInput = document.getElementById('csvFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }

  uploadCSV(): void {
    const fileInput = document.getElementById('csvFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); 
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name; 

      const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedCSVContent = e.target.result; 
    };
    reader.readAsDataURL(file);
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageName = file.name; 

      const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageContent = e.target.result; 
    };
    reader.readAsDataURL(file);
    }
  }

  search(event:any)
  {
    const query = event.target.value;
    this.query=query;
    this.queryChanged.emit(query);
  }


  uploadImage()
  {
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); 
    }
  }






}
