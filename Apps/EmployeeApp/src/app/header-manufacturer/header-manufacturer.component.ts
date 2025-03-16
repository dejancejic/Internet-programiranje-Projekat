import { CommonModule } from '@angular/common';
import { AfterViewInit, Component,EventEmitter,inject,Input,OnInit,Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Manufacturer } from '../model/manufacturer';
import { ManufacturerModalComponent } from "../modals/manufacturer-modal/manufacturer-modal.component";

declare var bootstrap: any;

@Component({
  selector: 'header-manufacturer',
  imports: [ReactiveFormsModule, CommonModule, ManufacturerModalComponent],
  templateUrl: './header-manufacturer.component.html',
  styleUrl: './header-manufacturer.component.css'
})
export class HeaderManufacturerComponent implements OnInit{


  @Input() count: number = 0;
  accountName: string = '';
  @Output() queryChanged=new EventEmitter<string>();
  @Output() typesChanged=new EventEmitter<string>();

  @Output() addManufacturerOutput:EventEmitter<Manufacturer>=new EventEmitter<Manufacturer>();


  @ViewChild('manufacturerModal1') manufacturerModal: any;

  query:string='';
  type='E-Car';


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
  let value = target.value; 
  
  this.type=value;
  this.typesChanged.emit(this.type);

  }

  addManufacturer(manu:Manufacturer)
  {
    this.addManufacturerOutput.emit(manu);
  }




}
