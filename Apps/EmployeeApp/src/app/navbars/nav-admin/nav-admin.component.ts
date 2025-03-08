import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { LogoutService } from '../../services/logout/logout.service';
import { Router } from '@angular/router';
@Component({
  selector: 'nav-admin',
  imports: [MatIconModule],
  templateUrl: './nav-admin.component.html',
  styleUrl: './nav-admin.component.css',
  providers:[LogoutService]
})
export class NavAdminComponent implements OnInit {

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
}


logout()
{
  this.logoutService.logout();
}


selectedTab: string = 'cars'; 

  selectTab(tabId: string): void {
    this.selectedTab = tabId; 
    this.router.navigate(['/transport', tabId]);

  }

  

}
