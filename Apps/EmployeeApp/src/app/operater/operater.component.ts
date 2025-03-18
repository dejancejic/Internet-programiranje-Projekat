import { Component, inject, OnInit } from '@angular/core';
import { NavOperatorComponent } from "../navbars/nav-operator/nav-operator.component";
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/utils/auth.service';

@Component({
  selector: 'app-operater',
  imports: [NavOperatorComponent,CommonModule, FormsModule, HttpClientModule,RouterOutlet],
  templateUrl: './operater.component.html',
  styleUrl: './operater.component.css'
})
export class OperaterComponent implements OnInit {
  selectedTab: string = 'rentals'; 
 authService=inject(AuthService);
  updateSelectedTab(tab: string) {
    this.selectedTab = tab;
  }
  ngOnInit(): void {
    this.authService.checkUserAccessToPage('operator');
  }
}
