import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LogoutService } from '../services/logout/logout.service';

import { NavAdminComponent } from "../navbars/nav-admin/nav-admin.component";
import { VehiclesComponent } from "../vehicles/vehicles.component";
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/utils/auth.service';

@Component({
  selector: 'app-transport',
  imports: [CommonModule, FormsModule, HttpClientModule, NavAdminComponent, RouterOutlet],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.css',
  providers:[LogoutService,AuthService]
})
export class TransportComponent implements OnInit{

  selectedTab: string = 'car'; 
  authService=inject(AuthService);

  updateSelectedTab(tab: string) {
    this.selectedTab = tab;
  }
  ngOnInit(): void {
    this.authService.checkUserAccessToPage('admin');
  }

}
