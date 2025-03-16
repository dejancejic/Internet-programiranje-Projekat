import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavAdminComponent } from '../nav-admin/nav-admin.component';
import { LogoutService } from '../../services/logout/logout.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nav-manager',
  imports: [CommonModule,MatIconModule],
  templateUrl: './nav-manager.component.html',
  styleUrl: './nav-manager.component.css'
})
export class NavManagerComponent {

   static showInfoTab=false;
  
    get showInfoTab() {
      return NavManagerComponent.showInfoTab;
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
      NavManagerComponent.showInfoTab=true;
    }
    else if(window.location.href.includes('statistics')){
      this.selectedTab='statistics';
    }
    else if(window.location.href.includes('prices')){
      this.selectedTab='prices';
    }
    else{
      this.selectedTab='cars';
      this.router.navigate(['manager','cars']);
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
      NavManagerComponent.showInfoTab=false;
      this.router.navigate(['manager', tabId]);
      }
      else{
        NavManagerComponent.showInfoTab=true;
      }
  
    }

}
