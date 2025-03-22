import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Manufacturer } from '../../model/manufacturer';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManufacturerModalComponent } from "../../modals/manufacturer-modal/manufacturer-modal.component";

declare var bootstrap: any;

@Component({
  selector: 'manufacturer-tab',
  imports: [CommonModule, ReactiveFormsModule, ManufacturerModalComponent],
  templateUrl: './manufacturer-tab.component.html',
  styleUrl: './manufacturer-tab.component.css'
})
export class ManufacturerTabComponent {

  @Input() manufacturer:Manufacturer|null=null;
  @Input() type:string='E-Car';
  @Output() removeManu=new EventEmitter(); 
  @Output() updateManu=new EventEmitter<Manufacturer>(); 


  @ViewChild('manufacturerModal') manufacturerModal: any;


  

  formBuilder=inject(FormBuilder);
  
    selectedForm:FormGroup=this.formBuilder.group({
      id:[null],
      name:[null,Validators.required],
      country:[null,Validators.required],
      address:[null,Validators.required],
      phone:[null,Validators.required],
      fax:[null],
      email:[null,Validators.required],
      deleted:[null]
    });

  removeManufacturer(event:Event)
  {
    event.stopPropagation();
    this.removeManu.emit();
  }


  showUpdateModal()
  {
    this.manufacturerModal.showModal(this.manufacturer);
  }

  updateManufacturer(manufacturer:Manufacturer)
  {
    this.manufacturer=manufacturer;
    this.updateManu.emit(this.manufacturer!);
  
  }


}
