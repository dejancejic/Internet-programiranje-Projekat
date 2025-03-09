import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

let currentPage = 1;
const usersPerPage = 6;
@Component({
  selector: 'app-accounts',
  imports: [CommonModule,FormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {

  @Input() query:string='';
  adminsSelected=false;

  showAddAdminForm=false;
  loading=false;


  ngOnInit(): void {
    this.switchTab('clients');
  }

  switchTab(tab: string) {
    if (tab === 'employees')
       { this.adminsSelected = true; }
        else {
           this.adminsSelected = false; }

           this.setTable();
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    let el = document.getElementById(tab + '-tab');
    el?.classList.add('active-tab');
}


  search()
  {

  }

  onSelectionChange(event: Event) { 
  }

  setTable()
  {

  }

  addEmployee()
  {

  }
  closeModal()
  {
    
  }
}
