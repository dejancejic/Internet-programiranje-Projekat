import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LogoutService } from '../services/logout/logout.service';
import { TransportService } from '../services/transport/transport.service';
import { NavAdminComponent } from "../navbars/nav-admin/nav-admin.component";
import { VehiclesComponent } from "../vehicles/vehicles.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-transport',
  imports: [CommonModule, FormsModule, HttpClientModule, NavAdminComponent, RouterOutlet],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.css',
  providers:[LogoutService,TransportService]
})
export class TransportComponent {

  selectedTab: string = 'car'; 

  updateSelectedTab(tab: string) {
    this.selectedTab = tab;
  }

}
