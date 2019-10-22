import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm : FormGroup;
  constructor() { }

  ngOnInit() {
    this.employeeForm = new FormGroup({ 
        fullName : new FormControl(),
        email : new FormControl(),
        skills :new FormGroup({
          skillName : new FormControl(),
          experienceInYear : new FormControl(),
          proficiency : new FormControl()
        })
    });
  }
  onLoadDataClick() : void {
    //This method is used when some parth of form controll are set
    this.employeeForm.patchValue({
      fullName : 'Ashutosh Sonawane',
      email : 'Ashutosh@sonawane@123',
      /*skills : {
        skillName : 'C',
        experienceInYear : 5,
        proficiency : 'intermediate'
      }*/
    });
    /*
     //This method is used when all form controll are set
    this.employeeForm.setValue({
      fullName : 'Ashutosh Sonawane',
      email : 'Ashutosh@sonawane@123',
      /*skills : {
        skillName : 'C',
        experienceInYear : 5,
        proficiency : 'intermediate'
      }
    });
     */
  }
  onSubmit() : void{
    console.log(this.employeeForm.controls.fullName);
  }
}
