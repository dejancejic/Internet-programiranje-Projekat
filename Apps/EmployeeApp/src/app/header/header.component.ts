import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Manufacturer } from '../model/manufacturer';
import { ManufacturerService } from '../services/manufacturers/manufacturer.service';
import { CarsService } from '../services/cars/cars.service';
import { CSVserviceService } from '../services/utils/csvservice.service';
import { BikeService } from '../services/bike/bike.service';
import { ScootersService } from '../services/scooters/scooters.service';
import { ScootersComponent } from '../scooters/scooters.component';


declare var bootstrap: any;

@Component({
  selector: 'vehicles-header',
  imports: [CommonModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[ManufacturerService,CarsService,CSVserviceService,BikeService,ScootersService]
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

  
  @ViewChild('addBikeModal') addBikeModal: any; 
  @ViewChild('addScooterModal') addScooterModal: any; 

  @ViewChild('successModal') successModal: any; 

  selectedFileName: string = '';
  selectedImageName: string = '';
  selectedImageCSVName: string = '';

  selectedImageContent:string='';
  selectedImageCSVContent:string='';
  selectedCSVContent:string='';
  selectedCSVFile:any=null;



  fileError: boolean = false;
  networkError: boolean = false;
  imageError=false;
  sameIdError=false;
  csvError=false;
  modalInstanceCSV: any;
  modalInstanceAdd: any;

  modalInstanceBikeAdd: any;
  modalInstanceScooterAdd: any;

  modalInstanceSuccess:any;





  manufacturers:Manufacturer[]=[];
  manufacturerService=inject(ManufacturerService);
  carsService=inject(CarsService);
  bikeService=inject(BikeService);
  scooterService=inject(ScootersService);
  csvService=inject(CSVserviceService);

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


    selectedFormBike:FormGroup=this.formBuilder.group({
      bikeId:[null,Validators.required],
      manufacturerId:[null,Validators.required],
      model:[null,Validators.required],
      price:[null,[
        Validators.required,
        Validators.min(0.1),
        Validators.max(299.99),
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ]],
      range:[null,Validators.required]
    });

    selectedFormScooter:FormGroup=this.formBuilder.group({
      scooterId:[null,Validators.required],
      manufacturerId:[null,Validators.required],
      model:[null,Validators.required],
      price:[null,[
        Validators.required,
        Validators.min(0.1),
        Validators.max(599.99),
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ]],
      speed:[null,Validators.required,
        Validators.min(0),
        Validators.max(60),Validators.pattern('^[0-9]+')]
    });


  
  ngOnInit(): void {
    
    if(sessionStorage.getItem("account")!==null)
      {
        this.accountName=sessionStorage.getItem("account")!;
      }
      this.getManufacturers();
  }

  openAddDialog()
  {
    if(this.type==='cars')
    {
      this.modalInstanceAdd.show();
    }
    else if(this.type==='bikes')
    {
      this.modalInstanceBikeAdd.show();
    }
    else if(this.type==='scooters')
    {
      this.modalInstanceScooterAdd.show();
    }
  }

  openCSVDialog()
  {
      this.modalInstanceCSV.show();
  }




  ngAfterViewInit() {
  
    const modalElementAdd = this.addVehicleModal.nativeElement;
    this.modalInstanceAdd = new bootstrap.Modal(modalElementAdd);

    const modalElementCSV = this.addVehicleCSVModal.nativeElement;
    this.modalInstanceCSV = new bootstrap.Modal(modalElementCSV);


    const modalElementAddBike = this.addBikeModal.nativeElement;
    this.modalInstanceBikeAdd = new bootstrap.Modal(modalElementAddBike);

    const modalElementAddScooter = this.addScooterModal.nativeElement;
    this.modalInstanceScooterAdd = new bootstrap.Modal(modalElementAddScooter);


    const modalElementSuccess = this.successModal.nativeElement;
    this.modalInstanceSuccess = new bootstrap.Modal(modalElementSuccess);
  }

  dismiss() {
    this.fileError = false;
    this.networkError = false;
    this.imageError=false;
    this.sameIdError=false;
    this.csvError=false;
  }

  addVehicleToSystem()
  {
    if(this.type==='cars'){
    let car=this.selectedForm.value;
    if(this.selectedImageContent===''){
      this.imageError=true;
      return;
    }else{
    car.image=this.selectedImageContent;
    }
    
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
  else if(this.type==='bikes')
  {
    let bike=this.selectedFormBike.value;
    if(this.selectedImageContent===''){
      this.imageError=true;
      return;
    }else{
    bike.image=this.selectedImageContent;
    }

    this.bikeService.addBike(bike).subscribe((data:any)=>{

      this.addedVehicle.emit(data);

    this.modalInstanceBikeAdd.hide();

    this.modalInstanceSuccess.show();

    this.selectedFormBike.reset();


    },(error:any)=>{
      if(error.toString().includes('same bike'))
      {
        this.sameIdError=true;
      }
      else{
      this.networkError=true;
      }
    });



  }
  else if(this.type==='scooters')
  {
    let scooter=this.selectedFormScooter.value;
    if(this.selectedImageContent===''){
      this.imageError=true;
      return;
    }else{
    scooter.image=this.selectedImageContent;
    }

    this.scooterService.addScooter(scooter).subscribe((data:any)=>{

      this.addedVehicle.emit(data);

    this.modalInstanceScooterAdd.hide();

    this.modalInstanceSuccess.show();

    this.selectedFormScooter.reset();


    },(error:any)=>{
      if(error.toString().includes('same scooter'))
      {
        this.sameIdError=true;
      }
      else{
      this.networkError=true;
      }
    });
  }
  }

  closeModal()
  {
    this.selectedForm.reset();
    this.selectedFormBike.reset();
    this.selectedFormScooter.reset();
  }

  async addVehicleCSV() {
    if (this.selectedFileName.length == 0) {
      this.fileError = true;
    } else {
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;

      if(this.type==='cars'){
        
      
      let createdCar= await this.csvService.verifyCSV(this.selectedCSVFile,fileInput);


      if(createdCar!==null){
        if(this.selectedImageCSVContent===''){
          this.imageError=true;
          return;
        }else{
        createdCar.image=this.selectedImageCSVContent;
        }
        

        this.carsService.addCar(createdCar).subscribe((data:any)=>{

          this.addedVehicle.emit(data);

          if (this.modalInstanceCSV) {
            this.modalInstanceCSV.hide(); 
          }
          this.removeCSV();
          this.fileError = false;
          this.networkError=false;
          this.csvError=false;
    
        this.modalInstanceSuccess.show();
    
    
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
    else{
      this.csvError=true;
    }
    }
    else if(this.type==='bikes')
      {
        let createdBike= await this.csvService.verifyCSVBike(this.selectedCSVFile,fileInput);


        if(createdBike!==null){
          if(this.selectedImageCSVContent===''){
            this.imageError=true;
            return;
          }else{
          createdBike.image=this.selectedImageCSVContent;
          }
        this.bikeService.addBike(createdBike!).subscribe((data:any)=>{

          this.addedVehicle.emit(data);

          if (this.modalInstanceCSV) {
            this.modalInstanceCSV.hide(); 
          }
          this.removeCSV();
          this.fileError = false;
          this.networkError=false;
          this.csvError=false;
    
        this.modalInstanceSuccess.show();
    
    
        },(error:any)=>{
          if(error.toString().includes('same bike'))
          {
            this.sameIdError=true;
          }
          else{
          this.networkError=true;
          }
        });
      }
      else
      {
        this.csvError=true;
      }


      }
      else if(this.type==='scooters')
      {
        let createdScooter= await this.csvService.verifyCSVScooter(this.selectedCSVFile,fileInput);


        if(createdScooter!==null){
          if(this.selectedImageCSVContent===''){
            this.imageError=true;
            return;
          }else{
            createdScooter.image=this.selectedImageCSVContent;
          }
        this.scooterService.addScooter(createdScooter!).subscribe((data:any)=>{

          this.addedVehicle.emit(data);

          if (this.modalInstanceCSV) {
            this.modalInstanceCSV.hide(); 
          }
          this.removeCSV();
          this.fileError = false;
          this.networkError=false;
          this.csvError=false;
    
        this.modalInstanceSuccess.show();
    
    
        },(error:any)=>{
          if(error.toString().includes('same scooter'))
          {
            this.sameIdError=true;
          }
          else{
          this.networkError=true;
          }
        });
      }
      else
      {
        this.csvError=true;
      }
      }
    }
  }

  removeCSV() {
    this.selectedFileName = '';
    this.selectedCSVFile=null;
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

    this.selectedCSVFile=file;
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


  onCSVImageSelected(event:any)
  {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageCSVName = file.name; 

      const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageCSVContent = e.target.result; 
    };
    reader.readAsDataURL(file);
    }
  }

  uploadCSVImage()
  {
    const fileInput = document.getElementById('imageFileCSV') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); 
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
