import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { LogoutService } from '../../services/logout/logout.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'nav-admin',
  imports: [MatIconModule,CommonModule],
  templateUrl: './nav-admin.component.html',
  styleUrl: './nav-admin.component.css',
  providers:[LogoutService]
})
export class NavAdminComponent implements OnInit {

  static showInfoTab=false;

  get showInfoTab() {
    return NavAdminComponent.showInfoTab;
  }

  constructor(private logoutService:LogoutService,private router:Router){}

ngOnInit(): void {
  
  if(window.location.href.includes('manufacturer-add')){
    this.selectedTab='manufacturer-add';
  }
  else if(window.location.href.includes('bikes')){
    this.selectedTab='bikes';
  }
  else if(window.location.href.includes('scooters')){
    this.selectedTab='scooters';
  }
  else if(window.location.href.includes('account')){
    this.selectedTab='accounts';
  }
  else if(window.location.href.includes('details')){
    this.selectedTab='details';
    NavAdminComponent.showInfoTab=true;
  }
  else{
    this.selectedTab='cars';
    this.router.navigate(['transport/cars']);
  }

}


logout()
{
  this.logoutService.logout();
}


selectedTab: string = 'cars'; 

  selectTab(tabId: string): void {

    if(tabId!=='details'){
    this.selectedTab = tabId; 
    NavAdminComponent.showInfoTab=false;
    this.router.navigate(['/transport', tabId]);
    }
    else{
      NavAdminComponent.showInfoTab=true;
    }

  }

  

}
