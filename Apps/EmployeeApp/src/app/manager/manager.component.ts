import { Component, inject, OnInit } from '@angular/core';
import { NavManagerComponent } from "../navbars/nav-manager/nav-manager.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/utils/auth.service';

@Component({
  selector: 'app-manager',
  imports: [NavManagerComponent,RouterOutlet,CommonModule, FormsModule, HttpClientModule],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent implements OnInit {

  selectedTab: string = 'cars'; 
 authService=inject(AuthService);
  updateSelectedTab(tab: string) {
    this.selectedTab = tab;
  }
  ngOnInit(): void {
    this.authService.checkUserAccessToPage('manager');
  }
}
