import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../model/employee';

declare var bootstrap: any;

@Component({
  selector: 'employee-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements AfterViewInit, OnChanges {

  @Input() update: boolean = false;
  @Input() employee:Employee|null=null;
  @Input() doShow: boolean = false;

  @Output() addEmployeeFn=new EventEmitter<Employee>();
  @Output() updateEmployeeFn=new EventEmitter<Employee>();

  employeeForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder) {
    this.employeeForm = this.formBuilder.group(
      {
        id: [null],
        username: [null, Validators.required],
        password: [
          null,
          this.update===false?
          [Validators.required,Validators.minLength(5), Validators.maxLength(80)]:[],
        ],
        repeatPassword: [
          null, 
          this.update===false?
          [Validators.required,Validators.minLength(5), Validators.maxLength(80)]:[]
        ],
        name: [null, Validators.required],
        surname: [null, Validators.required],
        role: ['admin', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    if (password && repeatPassword && password !== repeatPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  modalInstanceAddEmployee: any;
  @ViewChild('addEmployeeModal', { static: false }) addEmployeeModal!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.addEmployeeModal?.nativeElement) {
        this.modalInstanceAddEmployee = new bootstrap.Modal(this.addEmployeeModal.nativeElement);
       
      } 
    }, 0); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doShow'] && this.modalInstanceAddEmployee) {
      if (this.doShow) {
        this.setForm();
        //this.show();
      } else {
        this.closeModal();
      }
    }
  }

  private setForm()
  {
    if(this.employee!==null){
      let val:any={
        id:this.employee.id,
        username: this.employee.username,
        password: null,
        repeatPassword: null,
      name: this.employee.name,
      surname: this.employee.surname,
      role: this.employee.role
      };
      this.employeeForm = this.formBuilder.group(
        {
          id: [null],
          username: [null, Validators.required],
          password: [
            null,
            this.update===false?
            [Validators.required,Validators.minLength(5), Validators.maxLength(80)]:[],
          ],
          repeatPassword: [
            null, 
            this.update===false?
            [Validators.required,Validators.minLength(5), Validators.maxLength(80)]:[]
          ],
          name: [null, Validators.required],
          surname: [null, Validators.required],
          role: ['admin', Validators.required],
        },
        { validators: this.passwordMatchValidator }
      );
      
      this.employeeForm.setValue(val);
      }
  }

  show() {
    this.setForm();

    if (this.modalInstanceAddEmployee) {
      this.modalInstanceAddEmployee.show();
    } 
  }

  closeModal() {
    this.doShow = false;
    if (this.modalInstanceAddEmployee) {
      this.modalInstanceAddEmployee.hide();
      this.employeeForm.reset();
      this.employeeForm.get('role')?.setValue('admin');
      this.employee=null;
    }
  }

  addEmployee()
  {
    this.employee = {
      id: this.employee?.id ?? 0, 
      username: this.employeeForm.value.username ?? '',
      password: this.employeeForm.value.password ?? '',
      repeatPassword: this.employeeForm.value.repeatPassword ?? '',
      name: this.employeeForm.value.name ?? '',
      surname: this.employeeForm.value.surname ?? '',
      role: this.employeeForm.value.role ?? ''
    } as Employee;


    if(this.update===true)
    {
      this.updateEmployeeFn.emit(this.employee!);
    }
    else 
    {
      this.addEmployeeFn.emit(this.employee!);
    }
    this.closeModal();
  }
}
