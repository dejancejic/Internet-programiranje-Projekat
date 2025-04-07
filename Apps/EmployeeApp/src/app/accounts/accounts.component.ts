import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {  FormsModule, Validators } from '@angular/forms';
import { AccountsService } from '../services/accounts/accounts.service';
import { HttpClientModule } from '@angular/common/http';
import { Client } from '../model/client';
import { Employee } from '../model/employee';
import { EmployeeComponent } from "../modals/employee/employee.component";
import { ConstantsService } from '../services/utils/constants.service';

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
  usersPerPage = inject(ConstantsService).PAGINATION_NUMBER;
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


  allEmployees:any[]=[];
  users: any[] = [];

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
   this.loadDataClients();
  }

  switchTab(tab: string) {
    this.users=[];
    this.currentPage = 1;
    if (tab === 'employees')
       { this.adminsSelected = true;
          this.loadDataEmployees(this.currentPage);    
        }
        else {
           this.adminsSelected = false;
           this.loadDataClients(this.currentPage);  
          }
           
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    let el = document.getElementById(tab + '-tab');
    el?.classList.add('active-tab');
}

loadDataEmployees(page: number = 1,query:string='')
{
  this.loading=true;
  this.currentPage = page;
  this.accountsService.getEmployees(page - 1, this.usersPerPage,query).toPromise().then((data: any) => {
    this.users=data.content;
    this.allEmployees=JSON.parse(JSON.stringify(data.content));
    this.totalPages = data.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.loading=false;
  },(error)=>{
    alert("Error reading data!");
    this.loading=false;
  });
}


loadDataClients(page: number = 1,query:string='')
{
  this.loading = true;
  this.currentPage = page;

  this.accountsService.getClients(page - 1, this.usersPerPage,query).subscribe((data: any) => {
    this.users=data.content;
    for(let cl of this.users)
    {
      if(!cl.image.startsWith('data:')){
        cl.image='data:image/png;base64,'+cl.image;
        }
    }
    this.totalPages = data.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.loading=false;
  },(error)=>{
    alert("Error reading data!");
    this.loading=false;
  });

}






  search(event:any)
  {
    const query = event.target.value.toLowerCase();

    this.currentPage=1;
    if(this.adminsSelected)
    {
      this.loadDataEmployees(this.currentPage,query);
    }
    else
    {
      this.loadDataClients(this.currentPage,query);
    }

  }

  onSelectionChange(event: Event) { 

    this.users=this.allEmployees;
    const target=event.target as HTMLSelectElement;

    this.selectedType=target.value;

    if(target.value==='Admins')
    {
      this.users = this.allEmployees.filter(emp => emp.role === 'admin');
    }
    else if(target.value==='Operators')
    {
      this.users = this.allEmployees.filter(emp => emp.role === 'operator');
    }
    else if(target.value==='Managers')
    {
      this.users = this.allEmployees.filter(emp => emp.role === 'manager');
    }

  }



  addEmployeeToSystem(employee:Employee)
  {
    this.accountsService.addEmployee(employee).subscribe((data:any)=>{
      employee.id=data.id;
    this.allEmployees.push(employee);
    
    this.users.push(employee);
    
    this.update=false;
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
    for(let emp of this.users)
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
      if(this.adminsSelected)
      {
        this.loadDataEmployees(page);
      }
      else
      {
        this.loadDataEmployees(page);
      }
   
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
            this.loadDataEmployees(this.currentPage);
          this.modalInstancDeleteSuccessModal.show();
        },(error)=>{
            this.deleteError=true;
            this.modalInstancDeleteSuccessModal.show();
        });
  }


}

