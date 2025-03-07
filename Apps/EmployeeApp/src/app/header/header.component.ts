import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

declare var bootstrap: any;

@Component({
  selector: 'vehicles-header',
  imports: [CommonModule,MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit,OnInit{
  @Input() type: string = 'car';
  @Input() count: number = 0;
  accountName: string = '';
  @Output() queryChanged=new EventEmitter<string>();
  
  query:string='';

  @ViewChild('addVehicleCSVModal') addVehicleCSVModal: any; 

  selectedFileName: string = '';
  fileError: boolean = false;
  modalInstance: any;
  
  ngOnInit(): void {
    
    if(sessionStorage.getItem("account")!==null)
      {
        this.accountName=sessionStorage.getItem("account")!;
      }
  }

  ngAfterViewInit() {
  
    const modalElement = this.addVehicleCSVModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalElement);
  }

  dismiss() {
    this.fileError = false;
  }

  addVehicleToSystem()
  {
    

  }

  addVehicle() {
    if (this.selectedFileName.length == 0) {
      this.fileError = true;
    } else {
      
      if (this.modalInstance) {
        this.modalInstance.hide(); 
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
    }
  }

  search(event:any)
  {
    const query = event.target.value;
    this.query=query;
    this.queryChanged.emit(query);
  }


}
