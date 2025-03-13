import { Component } from '@angular/core';
import { OperatorHeaderComponent } from "../operator-header/operator-header.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Client } from '../model/client';

@Component({
  selector: 'app-clients',
  imports: [OperatorHeaderComponent,CommonModule,HttpClientModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {

  clients:Client[]=[];
  loading:boolean=false;


  search(event:any)
  {


  }

}
