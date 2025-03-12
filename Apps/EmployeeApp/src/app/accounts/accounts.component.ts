import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {  FormsModule, Validators } from '@angular/forms';
import { AccountsService } from '../services/accounts/accounts.service';
import { HttpClientModule } from '@angular/common/http';
import { Client } from '../model/client';
import { Employee } from '../model/employee';
import { EmployeeComponent } from "../modals/employee/employee.component";

declare var bootstrap:any;

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, FormsModule, HttpClientModule, EmployeeComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  providers:[AccountsService],
  encapsulation:ViewEncapsulation.None
})
export class AccountsComponent implements OnInit,AfterViewInit {

  currentPage = 1;
  usersPerPage = 6;
  totalPages = 0;
  pages: number[] = [];
  statusFailed=false;
  employeeFailed=false;
  sameEmployeeError=false;
  deleteError=false;

  @Input() query:string='';
  adminsSelected=false;

  showAddAdminForm=false;

  showUpdateForm=false;

  loading=false;
  update=false;


  allClients:Client[]=[];
  allEmployees:Employee[]=[];

  clients:Client[]=[];
  employees:Employee[]=[];

  paginatedUsers: any[] = [];

  selectedType='All types';

  accountsService=inject(AccountsService);


  selectedEmployee:Employee|null=null;
  

  modalInstanceSuccessStatus: any;
  @ViewChild('successStatusModal') successStatusModal: any;
  modalInstanceSuccessEmployee: any;
  @ViewChild('successEmployeeModal') successEmployeeModal: any;
  modalInstancDeleteSuccessModal: any;
  @ViewChild('deleteSuccessModal') deleteSuccessModal: any;
  modalInstanceSureToDeleteModal: any;
  @ViewChild('sureToDeleteModal') sureToDeleteModal: any;


  @ViewChild('addEmployeeModal') addEmployeeModal!: EmployeeComponent;

  @ViewChild('updateEmployeeModal') updateEmployeeModal!: EmployeeComponent;
  
  openAddModal() {
    this.showAddAdminForm = true;

    setTimeout(() => {
      if (this.addEmployeeModal?.modalInstanceAddEmployee) {
        this.addEmployeeModal.show();
      } 
    }, 0); 
  }

  openUpdateModal() {
    this.showUpdateForm = true;
    this.updateEmployeeModal.employee=this.selectedEmployee;

    setTimeout(() => {
      if (this.updateEmployeeModal?.modalInstanceAddEmployee) {
        this.updateEmployeeModal.show();
      } 
    }, 0); 
  }

  updatePagination() {
    const collection = this.adminsSelected ? this.employees : this.clients;
    this.totalPages = Math.ceil(collection.length / this.usersPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedUsers = collection.slice(
      (this.currentPage - 1) * this.usersPerPage,
      this.currentPage * this.usersPerPage
    );
  }

  ngAfterViewInit(): void {
    const modalElementStatus = this.successStatusModal.nativeElement;
  this.modalInstanceSuccessStatus = new bootstrap.Modal(modalElementStatus);

  const modalElementEmployee = this.successEmployeeModal.nativeElement;
  this.modalInstanceSuccessEmployee = new bootstrap.Modal(modalElementEmployee);


  const modalElementDelete = this.sureToDeleteModal.nativeElement;
  this.modalInstanceSureToDeleteModal = new bootstrap.Modal(modalElementDelete);


  const modalElementDeleteSuccess = this.deleteSuccessModal.nativeElement;
  this.modalInstancDeleteSuccessModal = new bootstrap.Modal(modalElementDeleteSuccess);

  }



  ngOnInit(): void {
    this.initialize();
  }

  switchTab(tab: string) {
    if (tab === 'employees')
       { this.adminsSelected = true;
        
        }
        else {
           this.adminsSelected = false; }
           
    this.currentPage = 1;
    this.updatePagination();
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    let el = document.getElementById(tab + '-tab');
    el?.classList.add('active-tab');
}

private async initialize(): Promise<void> {
  try {
    this.loading = true;

    this.switchTab('clients');

    await Promise.all([
      this.accountsService.getClients().toPromise().then((data: any) => {
        this.clients = data;
        for(let cl of this.clients)
        {
          if(!cl.image.startsWith('data:')){
            cl.image='data:image/png;base64,'+cl.image;
            }
        }
        this.allClients = data;

        this.currentPage = 1;
        this.updatePagination();
      }),
      this.accountsService.getEmployees().toPromise().then((data: any) => {
        this.employees = data;
        this.allEmployees = data;
        
      }),
    ]);
  } catch (error:any) {
    alert(error.message || 'An error occurred');
  } finally {
    this.loading = false;
  }
}




  search(event:any)
  {
    const query = event.target.value.toLowerCase();

    if(!query.trim() || query==='')
    {
      if(this.adminsSelected){
        if(this.selectedType!=='All types'){
      this.employees=this.allEmployees.filter(e=>e.role===this.selectedType);
        }
        else 
        {
          this.employees=this.allEmployees;
        }
      }
      else{
        this.clients=this.allClients;
      }
      this.updatePagination();
      return;
    }

    if(this.adminsSelected)
    {
      if(this.selectedType!=='All types'){
    this.employees=this.allEmployees.filter(e=>e.role===this.selectedType &&(e.name.toLowerCase().includes(query)||
    e.surname.toLowerCase().includes(query)||
    e.username.toLowerCase().includes(query)));
      }
      else{
        this.employees=this.allEmployees.filter(e=>e.name.toLowerCase().includes(query)||
        e.surname.toLowerCase().includes(query)||
        e.username.toLowerCase().includes(query));
      }
    }
    else{
     this.clients= this.allClients.filter(c=>c.name.toLowerCase().includes(query)||
    c.surname.toLowerCase().includes(query)||c.email.toLowerCase().includes(query) ||
     c.username.toLowerCase().includes(query));
    }

    this.updatePagination();
  }

  onSelectionChange(event: Event) { 

    this.employees=this.allEmployees;
    const target=event.target as HTMLSelectElement;

    this.selectedType=target.value;

    if(target.value==='Admins')
    {
      this.employees = this.allEmployees.filter(emp => emp.role === 'admin');
    }
    else if(target.value==='Operators')
    {
      this.employees = this.allEmployees.filter(emp => emp.role === 'operator');
    }
    else if(target.value==='Managers')
    {
      this.employees = this.allEmployees.filter(emp => emp.role === 'manager');
    }
    this.updatePagination();
  }



  addEmployeeToSystem(employee:Employee)
  {
    this.accountsService.addEmployee(employee).subscribe((data:any)=>{
      employee.id=data.id;
    this.allEmployees.push(employee);
    if(this.selectedType===employee.role){
    this.employees.push(employee);
    }

    this.update=false;
    this.updatePagination();
   
    this.modalInstanceSuccessEmployee.show();
  },(error:any)=>{
    this.employeeFailed=true;
    if(error.toString().includes("username already exists")){
      this.sameEmployeeError=true;
    }  
    this.modalInstanceSuccessEmployee.show();
  });
  }

  updateEmployeeToSystem(employee:Employee)
  {
    this.selectedEmployee=employee;
    this.accountsService.updateEmployee(employee).subscribe((data:any)=>{
      this.update=true;
    for(let emp of this.allEmployees)
    {
      if(emp.id===employee.id)
      {
      emp.username = employee.username;
      emp.password = employee.password;
      emp.name = employee.name;
      emp.surname = employee.surname;
      emp.role = employee.role;
        break;
      }
    }
    for(let emp of this.employees)
      {
        if(emp.id===employee.id)
        {
      emp.username = employee.username;
      emp.password = employee.password;
      emp.name = employee.name;
      emp.surname = employee.surname;
      emp.role = employee.role;
          break;
        }
      }

    this.updatePagination();
    
  this.modalInstanceSuccessEmployee.show();
     } ,(error)=>{
      this.employeeFailed=true;
      if(error.toString().includes("username already exists")){
        this.sameEmployeeError=true;
      } 
      this.modalInstanceSuccessEmployee.show();
    });
  }

  closeError()
  {
    this.employeeFailed=false;
    this.sameEmployeeError=false;
    this.deleteError=false;
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

  updateEmployee(employee:Employee)
  {
      this.selectedEmployee=employee;
      this.openUpdateModal();
  }

  deleteEmployee(employee:Employee)
  {
      
      this.selectedEmployee=employee;
      this.showDeleteModal();
  }

  showDeleteModal()
  {
    this.modalInstanceSureToDeleteModal.show();
  }
  deleteEmployeeToSystem()
  {

     this.accountsService.deleteEmployee(this.selectedEmployee!.id).subscribe((data:any)=>{
      this.deleteError=false;
     let index=0;
        for(let emp of this.allEmployees)
        {
          if(emp.id===this.selectedEmployee?.id)
          {
            this.employees.splice(index,1);
            break;
          }
          index++;
        }
        index=0;
        for(let emp of this.employees)
          {
            if(emp.id===this.selectedEmployee?.id)
            {
              this.employees.splice(index,1);
              break;
            }
            index++;
          }
          this.updatePagination();
          this.modalInstancDeleteSuccessModal.show();
        },(error)=>{
            this.deleteError=true;
            this.modalInstancDeleteSuccessModal.show();
        });
  }


}

