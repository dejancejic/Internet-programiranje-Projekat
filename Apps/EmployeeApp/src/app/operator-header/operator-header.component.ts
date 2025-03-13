import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'operator-header',
  imports: [CommonModule],
  templateUrl: './operator-header.component.html',
  styleUrl: './operator-header.component.css'
})
export class OperatorHeaderComponent {

  @Input() count:number=0;
  @Input() type:string='E-Car';
  @Input() toShow:string='rentals';
  @Input() showSelect:boolean=true;
  @Input() title:string='Rentals';
  @Input() searchBy:string='Search by name...';
  @Output() queryChanged=new EventEmitter<string>();
  @Output() typesChanged=new EventEmitter<string>();


  search(event:any)
  {
    const query = event.target.value;
    this.queryChanged.emit(query);
  }

  select(event: any) {
    const target = event.target as HTMLSelectElement;
  let value = target.value; 
  
  
  this.type=value;
  this.typesChanged.emit(this.type);

  }


}
