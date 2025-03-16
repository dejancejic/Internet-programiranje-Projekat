import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicles/vehicle.service';
import { Vehicle } from '../../model/vehicle';
import { HttpClientModule } from '@angular/common/http';

declare var bootstrap:any;
@Component({
  selector: 'update-price-modal',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './update-price.component.html',
  styleUrl: './update-price.component.css',
  providers:[VehicleService]
})
export class UpdatePriceComponent implements AfterViewInit {

  @Input() selectedVehicle:any;
  @Input() selectedType:string='E-Car';
  modalInstanceUpdatePriceModal: any;
  modalInstanceSuccessModal: any;
  @ViewChild("updatePriceModal") updatePriceModal:any;
  @ViewChild("successModal") successModal:any;
  error:boolean=false;

  vehicleService=inject(VehicleService);

  formBuilder=inject(FormBuilder);

  selectedForm=this.formBuilder.group({
    price:[null,[
      Validators.required,
      Validators.min(0.1),
      Validators.max(599.99),
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ]],
  });

  ngAfterViewInit(): void {
    const modalElement=this.updatePriceModal.nativeElement;
    this.modalInstanceUpdatePriceModal=new bootstrap.Modal(modalElement);

    const modalElementSuccess=this.successModal.nativeElement;
    this.modalInstanceSuccessModal=new bootstrap.Modal(modalElementSuccess);
  }

  showModal()
  {
    this.modalInstanceUpdatePriceModal.show();
    setTimeout(()=>{
      this.selectedForm.setValue({ price: this.selectedVehicle.price });

    },20);
  }

  hideModal()
  {
    this.modalInstanceUpdatePriceModal.hide();
  }
  hideModalSuccess()
  {
    this.error=false;
  }

  updatePrice()
  {

    this.vehicleService.updateRentalPrice(this.selectedVehicle,this.selectedForm.get('price')?.value!,this.selectedType).subscribe((data:any)=>{
      this.selectedVehicle.price=this.selectedForm.get('price')?.value!;
      this.hideModal();
    this.modalInstanceSuccessModal.show();
    },(error)=>{
      this.error=true;
      this.hideModal();
    this.modalInstanceSuccessModal.show();
    })
  }

}
