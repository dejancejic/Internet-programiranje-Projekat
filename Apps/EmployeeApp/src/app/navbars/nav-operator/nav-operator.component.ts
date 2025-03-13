import { Component } from '@angular/core';
import { LogoutService } from '../../services/logout/logout.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nav-operator',
  imports: [CommonModule,MatIconModule],
  templateUrl: './nav-operator.component.html',
  styleUrl: './nav-operator.component.css',
  providers:[LogoutService]
})
export class NavOperatorComponent {

    constructor(private logoutService:LogoutService,private router:Router){}
  
  ngOnInit(): void {
    
    if(window.location.href.includes('rentals')){
      this.selectedTab='rentals';
    }
    else if(window.location.href.includes('map')){
      this.selectedTab='map';
    }
    else if(window.location.href.includes('clients')){
      this.selectedTab='clients';
    }
    else if(window.location.href.includes('malfunctions')){
      this.selectedTab='malfunctions';
    }
    else{
      this.selectedTab='rentals';
      this.router.navigate(['operator',this.selectedTab]);
    }
  
  }
  
  
  logout()
  {
    this.logoutService.logout();
  }
  
  
  selectedTab: string = 'rentals'; 
  
    selectTab(tabId: string): void {
      this.selectedTab = tabId; 
      this.router.navigate(['operator', tabId]);
    
    }

}
