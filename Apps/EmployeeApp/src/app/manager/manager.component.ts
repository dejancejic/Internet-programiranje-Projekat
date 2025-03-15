import { Component } from '@angular/core';
import { NavManagerComponent } from "../navbars/nav-manager/nav-manager.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manager',
  imports: [NavManagerComponent,RouterOutlet,CommonModule, FormsModule, HttpClientModule],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {

  selectedTab: string = 'cars'; 

  updateSelectedTab(tab: string) {
    this.selectedTab = tab;
  }
}
