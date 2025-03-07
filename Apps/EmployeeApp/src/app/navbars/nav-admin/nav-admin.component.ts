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
