import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm : FormGroup;
  emailPattern = "^([a-zA-Z0-9_\.]+)@([a-zA-Z0-9_\.]+)\.([a-zA-Z]{2,5})$";
  
  constructor(private formBuilder : FormBuilder) { }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      fullName : ['',[Validators.required,Validators.minLength(2),Validators.maxLength(20)]],
      email : ['',[Validators.required,Validators.pattern(this.emailPattern)]],//,Validators.pattern(``)]],
      skills :this.formBuilder.group({
        skillName : ['',Validators.required],
        experienceInYear : ['',Validators.required],
        proficiency : ['intermediate']
      })
    });
  }
  logKeyValuePairs(group:FormGroup):void{
   // console.log(Object.keys(group.controls));
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if(abstractControl instanceof FormGroup){
        this.logKeyValuePairs(abstractControl);
      }
      else{
        console.log("Key = "+ key + " Value = "+abstractControl.value);
      }
    });
  }
  onLoadDataClick() : void {
    //This method is used when some parth of form controll are set
    this.employeeForm.patchValue({
      fullName : 'Ashutosh Sonawane',
      email : 'Ashutosh@sonawane.co',
      
    });
    //This method is used when all form controll are set
   /*  this.employeeForm.setValue({
      fullName : 'Ashutosh Sonawane',
      email : 'Ashutosh@sonawane.co',
      skills : {
         skillName : 'C',
         experienceInYear : 5,
         proficiency : 'intermediate'
      }
    }); */
  }
  onSubmit() : void{
    console.log(this.employeeForm.controls.fullName);
    this.logKeyValuePairs(this.employeeForm);
  }
}
