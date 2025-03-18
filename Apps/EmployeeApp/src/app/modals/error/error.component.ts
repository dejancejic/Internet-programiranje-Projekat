import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

declare var bootstrap:any;
@Component({
  selector: 'error-modal',
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements AfterViewInit{

  title:string='';
  body:string='';

  modalInstance:any;
  @ViewChild("failModal") failModal:any;

ngAfterViewInit(): void {
  const modalElement=this.failModal.nativeElement;
    this.modalInstance=new bootstrap.Modal(modalElement);
}


showModal(title:string,body:string)
{
  this.title=title;
  this.body=body;
  this.modalInstance.show();
}

}
