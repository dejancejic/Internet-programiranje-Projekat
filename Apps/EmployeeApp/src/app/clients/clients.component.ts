import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { OperatorHeaderComponent } from "../operator-header/operator-header.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Client } from '../model/client';
import { AccountsService } from '../services/accounts/accounts.service';
import { ConstantsService } from '../services/utils/constants.service';
import { ErrorComponent } from "../modals/error/error.component";

declare var bootstrap:any;

@Component({
  selector: 'app-clients',
  imports: [OperatorHeaderComponent, CommonModule, HttpClientModule, ErrorComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  providers:[AccountsService]
})
export class ClientsComponent implements OnInit,AfterViewInit{

  accountsService=inject(AccountsService);

  clients:Client[]=[];
  loading:boolean=false;

  statusFailed=false;

  currentPage = 1;
  usersPerPage = inject(ConstantsService).PAGINATION_NUMBER;
  totalPages = 0;
  pages: number[] = [];

  modalInstanceSuccessStatus: any;
  @ViewChild('successStatusModal') successStatusModal: any;

  @ViewChild("errorModal") errorModal:any;

  ngOnInit(): void {
    this.loading=true;
    this.loadData();
    
  }


  loadData(page: number = 1,query:string='')
  {
    this.currentPage = page;
    this.loading=true;
    this.accountsService.getClients(page - 1, this.usersPerPage,query).subscribe((data: any) => {
      this.clients = data.content;
      for(let cl of this.clients)
      {
        if(!cl.image.startsWith('data:')){
          cl.image='data:image/png;base64,'+cl.image;
          }
      }
      this.totalPages = data.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.loading=false;
    },(error)=>{
      let msg=error.message;
      if(msg.includes("Progress")){
        msg="Server failed to respond!";
      }
      this.errorModal.showModal('Failed to load clients',msg);
      this.loading=false;
    })

  }

  ngAfterViewInit(): void {
    const modalElementStatus = this.successStatusModal.nativeElement;
    this.modalInstanceSuccessStatus = new bootstrap.Modal(modalElementStatus);
  }


  search(event:any)
  {
    const query = event.toLowerCase();

    this.currentPage=1;

    this.loadData(this.currentPage, query);

  }



  setStatus(user: Client) {
    this.statusFailed=false;

    user.blocked = !user.blocked;
    this.accountsService.setClientStatus(user.id, user.blocked).subscribe(
      (data:any)=>{ 
        this.modalInstanceSuccessStatus.show();
        //this.loadData(this.currentPage);
      },
      (error) =>{
        this.statusFailed=true;
        user.blocked = !user.blocked;
        this.modalInstanceSuccessStatus.show();
    }
    );
  }


  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadData(page);
    }
  }

  closeError()
  {

  }


}
