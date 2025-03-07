import { CommonModule } from '@angular/common';
import { AfterViewInit, Component,EventEmitter,inject,Input,OnInit,Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Manufacturer } from '../model/manufacturer';

declare var bootstrap: any;

@Component({
  selector: 'header-manufacturer',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './header-manufacturer.component.html',
  styleUrl: './header-manufacturer.component.css'
})
export class HeaderManufacturerComponent implements OnInit,AfterViewInit{


  @Input() count: number = 0;
  accountName: string = '';
  @Output() queryChanged=new EventEmitter<string>();
  @Output() typesChanged=new EventEmitter<string>();

  @Output() addManufacturerOutput=new EventEmitter<Manufacturer>();


  modalInstanceSuccess: any;
  modalInstanceAdd: any;
  @ViewChild('successModal') successModal: any;
  @ViewChild('addManufacturerModal') addManufacturerModal: any;

  query:string='';
  type='Car';

formBuilder=inject(FormBuilder);

  selectedForm:FormGroup=this.formBuilder.group({
    name:[null,Validators.required],
    country:[null,Validators.required],
    address:[null,Validators.required],
    phone:[null,Validators.required],
    fax:[null],
    email:[null,Validators.required]
  });

 ngAfterViewInit(): void {
  const modalElement = this.successModal.nativeElement;
  this.modalInstanceSuccess = new bootstrap.Modal(modalElement);
  const modalElement1 = this.addManufacturerModal.nativeElement;
  this.modalInstanceAdd = new bootstrap.Modal(modalElement1);
 }


  ngOnInit(): void {
    if(sessionStorage.getItem("account")!==null)
    {
      this.accountName=sessionStorage.getItem("account")!;
    }
  }
  search(event:any)
  {
    const query = event.target.value;
    this.query=query;
    this.queryChanged.emit(query);
  }

  select(event: any) {
    const target = event.target as HTMLSelectElement;
  const value = target.value; 
  this.type=value;

  this.typesChanged.emit(this.type);

  }

  addManufacturer()
  {
    this.addManufacturerOutput.emit(this.selectedForm.value);

    if (this.modalInstanceSuccess && this.modalInstanceAdd) {

      
      this.selectedForm.reset();
      this.modalInstanceAdd.hide();
      this.modalInstanceSuccess.show();
    }
  }

  getAllManufacturers()
  {

    
  }

  resetForm()
  {
    this.selectedForm.reset();
  }

}
