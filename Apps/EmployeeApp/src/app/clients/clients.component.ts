import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { OperatorHeaderComponent } from "../operator-header/operator-header.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Client } from '../model/client';
import { AccountsService } from '../services/accounts/accounts.service';

declare var bootstrap:any;

@Component({
  selector: 'app-clients',
  imports: [OperatorHeaderComponent,CommonModule,HttpClientModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  providers:[AccountsService]
})
export class ClientsComponent implements OnInit,AfterViewInit{

  accountsService=inject(AccountsService);

  clients:Client[]=[];
  allClients:Client[]=[];
  paginatedClients:Client[]=[];
  loading:boolean=false;

  statusFailed=false;

  currentPage = 1;
  usersPerPage = 6;
  totalPages = 0;
  pages: number[] = [];

  modalInstanceSuccessStatus: any;
  @ViewChild('successStatusModal') successStatusModal: any;

  ngOnInit(): void {
    this.loading=true;
    this.accountsService.getClients().subscribe((data: any) => {
      this.clients = data;
      for(let cl of this.clients)
      {
        if(!cl.image.startsWith('data:')){
          cl.image='data:image/png;base64,'+cl.image;
          }
      }
      this.allClients = JSON.parse(JSON.stringify(this.clients));

      this.loading=false;
      this.currentPage = 1;
      this.updatePagination();
    },(error)=>{
      alert("Error reading data!");
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

    if(!query.trim() || query==='')
    {
      this.clients=this.allClients;
      
      this.updatePagination();
      return;
    }

    this.clients= this.allClients.filter(c=>c.name.toLowerCase().includes(query)||
    c.surname.toLowerCase().includes(query)||c.email.toLowerCase().includes(query) ||
    (c.name.toLowerCase()+" "+c.surname.toLowerCase()).includes(query)||
     c.username.toLowerCase().includes(query));

     this.updatePagination();

  }

  updatePagination() {
    const collection =this.clients;
    this.totalPages = Math.ceil(collection.length / this.usersPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedClients = collection.slice(
      (this.currentPage - 1) * this.usersPerPage,
      this.currentPage * this.usersPerPage
    );
  }


  setStatus(user: Client) {
    this.statusFailed=false;

    user.blocked = !user.blocked;
    this.accountsService.setClientStatus(user.id, user.blocked).subscribe(
      (data:any)=>{ 
        this.modalInstanceSuccessStatus.show();
        this.updatePagination();
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
      this.currentPage = page;
      this.updatePagination();
    }
  }

  closeError()
  {

  }


}
