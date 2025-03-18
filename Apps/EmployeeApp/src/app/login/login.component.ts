import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { LoginService } from '../services/login/login.service';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from '../services/utils/auth.service';
import { ErrorComponent } from "../modals/error/error.component";
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatButtonModule, HttpClientModule, MatProgressSpinnerModule, ErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[LoginService,AuthService]
})

export class LoginComponent implements OnInit{
  @Input() username:string='';
  @Input() password:string='';


  @ViewChild("errorModal") errorModal:any;

  loading:boolean=false;

  authService=inject(AuthService);

  ngOnInit(): void {
    this.tokenLogin();
  }

  constructor(private loginService:LoginService,private router:Router){}

  focusNext(id:string)
  {
    let el=document.getElementById(id);
    if(el !== null)
    {
      el?.focus();
    }
  }


  login()
  {
    this.loading=true;
    this.loginService.login(this.username,this.password).subscribe((data: any) => {
      
      var accType=data.employee.role;
      
      sessionStorage.setItem("account",data.employee.name+' '+data.employee.surname);
      sessionStorage.setItem("accType",accType);
      if(accType === 'admin'){
      this.router.navigate(['transport','cars'], {
        state: { accType }
      });
    }
    else if(accType === 'operator')
    {
      this.router.navigate(['operator','rentals'], {
        state: { accType }
      });
      this.loading=false;
    }
    else if(accType==='manager')
      {
        this.router.navigate(['manager','cars'], {
          state: { accType }
        });
      }
    },(error:any)=>{
      this.errorModal.showModal('Failed to login',error.message);
      
      this.loading=false;
    });

  }

  tokenLogin()
  {
    
    if(this.authService.isLoggedIn()==false)
    {
      return;
    }
    this.loading=true;
    this.loginService.tokenLogin(this.authService.getToken()!).subscribe((data: any) => {
      
      var accType=data.employee.role;

      sessionStorage.setItem("account",data.employee.name+' '+data.employee.surname);
      sessionStorage.setItem("accType",accType);
      if(accType === 'admin'){
      this.router.navigate(['transport/cars'], {
        state: { accType }
      });
    }
    else if(accType === 'operator')
    {
      this.router.navigate(['operator','rentals'], {
        state: { accType }
      });
    }
    else if(accType==='manager')
    {
      this.router.navigate(['manager/cars'], {
        state: { accType }
      });
    }
    this.loading=false;
    },(error:any)=>{
      this.loading=false;
    });

  }

  forgotPassword()
  {
    
  }

}
