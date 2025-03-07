import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Manufacturer } from '../../model/manufacturer';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'manufacturer-tab',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './manufacturer-tab.component.html',
  styleUrl: './manufacturer-tab.component.css'
})
export class ManufacturerTabComponent implements AfterViewInit{

  @Input() manufacturer:Manufacturer|null=null;
  @Output() removeManu=new EventEmitter(); 
  @Output() updateManu=new EventEmitter<Manufacturer>(); 


  @ViewChild('successModal') successModal: any;
  @ViewChild('addManufacturerModal') updateManufacturerModal: any;

  modalInstanceSuccess: any;
  modalInstanceUpdate: any;

  ngAfterViewInit(): void {
    const modalElement = this.successModal.nativeElement;
  this.modalInstanceSuccess = new bootstrap.Modal(modalElement);
  const modalElement1 = this.updateManufacturerModal.nativeElement;
  this.modalInstanceUpdate = new bootstrap.Modal(modalElement1);

  this.selectedForm.setValue(this.manufacturer!);
  }

  

  formBuilder=inject(FormBuilder);
  
    selectedForm:FormGroup=this.formBuilder.group({
      id:[null],
      name:[null,Validators.required],
      country:[null,Validators.required],
      address:[null,Validators.required],
      phone:[null,Validators.required],
      fax:[null],
      email:[null,Validators.required]
    });

  removeManufacturer(event:Event)
  {
    event.stopPropagation();
    this.removeManu.emit();
  }


  showUpdateModal()
  {
    this.selectedForm.setValue(this.manufacturer!);
    this.modalInstanceUpdate.show();
  }

  updateManufacturer()
  {
    this.manufacturer=this.selectedForm.value;
    console.log(this.manufacturer);
    this.updateManu.emit(this.manufacturer!);
    
    if (this.modalInstanceSuccess && this.modalInstanceUpdate) {

      this.modalInstanceUpdate.hide();
      this.modalInstanceSuccess.show();
    }
  }


}
