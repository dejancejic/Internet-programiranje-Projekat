import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, Output, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Manufacturer } from '../../model/manufacturer';
import { ManufacturerService } from '../../services/manufacturers/manufacturer.service';

declare var bootstrap:any;

@Component({
  selector: 'manufacturer-modal',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './manufacturer-modal.component.html',
  styleUrl: './manufacturer-modal.component.css'
})
export class ManufacturerModalComponent implements AfterViewInit {

  @Input() type='E-Car';
  @Input() update:boolean=false;
  manufacturer:Manufacturer=null!;

  @Output() updateManufacturerFn:EventEmitter<Manufacturer>=new EventEmitter<Manufacturer>();
  @Output() addManufacturerFn:EventEmitter<Manufacturer>=new EventEmitter<Manufacturer>();


  manufacturerService=inject(ManufacturerService);
  error=false;
  

  formBuilder=inject(FormBuilder);  
 modalInstanceSuccess: any;
  modalInstanceAdd: any;
  @ViewChild('successModal', { static: true }) successModal!: ElementRef;
  @ViewChild('addManufacturerModal', { static: true }) addManufacturerModal!: ElementRef;

  constructor(private renderer: Renderer2, private viewContainerRef: ViewContainerRef) {}

  selectedForm:FormGroup=this.formBuilder.group({
      id:[null],
      name:[null,Validators.required],
      country:[null,Validators.required],
      address:[null,Validators.required],
      phone:[null,Validators.required],
      fax:[null],
      email: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      deleted:[null],
    });

    ngAfterViewInit(): void {
  const modalElement = this.successModal.nativeElement;
  this.modalInstanceSuccess = new bootstrap.Modal(modalElement);
  const modalElement1 = this.addManufacturerModal.nativeElement;
  this.modalInstanceAdd = new bootstrap.Modal(modalElement1);
  this.renderer.appendChild(document.body, this.addManufacturerModal.nativeElement);
  this.renderer.appendChild(document.body, this.successModal.nativeElement);
    }

    setForm()
    {
      this.selectedForm.setValue(this.manufacturer);
    }

    resetForm()
    {
      this.selectedForm.reset();
    }

    dismiss()
  {
    this.error=false;
  }

    showModal(manufacturer:Manufacturer)
    {
      this.manufacturer=manufacturer;
      this.selectedForm.setValue(this.manufacturer);
      this.modalInstanceAdd.show();
    }
    hideModal()
    {
      this.modalInstanceAdd.hide();
    }

    addManufacturer()
    {
      if(this.update===false){
      this.manufacturerService.addManufacturer(this.selectedForm.value,this.type).subscribe((data:any)=>{
        this.modalInstanceAdd.hide();
      this.modalInstanceSuccess.show();
      this.selectedForm.reset();
      this.addManufacturerFn.emit(data);
      },(error)=>{
        this.error=true;
      });
    }
    else {
      this.updateManufacturer();
    }
    }

    updateManufacturer()
    {
      console.log(this.manufacturer);
      this.manufacturerService.updateManufacturer(this.selectedForm.value).subscribe((data:any)=>{
       this.updateManufacturerFn.emit(data);
       this.modalInstanceAdd.hide();
      this.modalInstanceSuccess.show();
      this.selectedForm.reset();
      },(error)=>{
        this.error=true;
        });
    }

}
