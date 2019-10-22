import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm : FormGroup;
  emailPattern = "^([a-zA-Z0-9_\.]+)@([a-zA-Z0-9_\.]+)\.([a-zA-Z]{2,5})$";
  experiencePattern = "^[0-9]{1,2}$";
  phonePattern = "^[7-9]{1}[0-9]{7,9}";
  show:boolean = true;
  validationMessages = {
    'fullName' : {
      'required' : 'Full name is required.',
      'minlength': 'Full name be greater than 2 characters.',
      'maxlength': 'Full name be less than 20 characters.'
    },
    'emailGroup' :{
      'emailMismatch' : 'Email and conferm email fild must have same value.'
    },
    'email' : {
      'required' : 'Email is required.',
      'pattern'  : 'please enter valid email address.'
    },
    'confirmEmail' : {
      'required' : 'Confirm email is required.',
      'pattern'  : 'please enter valid email address.'
    },
    'phoneGroup' :{
      'phoneMismatch' : 'Phone and conferm phone fild must have same value.'
    },
    'phone' : {
      'required' : 'Phone number is required.',
      'pattern'  : 'please enter valid phone number.'
    },
    'confirmPhone' : {
      'required' : 'Confirm phone number is required.',
      'pattern'  : 'please enter valid confirm phone number.'
    }
  }; 

  formErrors = {
    /* 'fullName' : '',
    'emailGroup':'',
    'email' : '',
    'confirmEmail' : '',
    'phoneGroup' : '',
    'phone' : '',
    'confirmPhone':'', */
  }; 
  constructor(private formBuilder : FormBuilder) { }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      fullName : ['',[Validators.required,Validators.minLength(2),Validators.maxLength(20)]],
      contactPreference : ['email'],
      emailGroup : this.formBuilder.group({
        email : [''],
        confirmEmail : [''],
      },{validator:matchEmail}),
      phoneGroup : this.formBuilder.group({
        phone : [''],
        confirmPhone : [''],
      }),
      skills :this.formBuilder.array([
        this.addSkillFormGroup()
      ])
    });
    this.onContactPreferenceChange('email');
    this.employeeForm.get('contactPreference').valueChanges.subscribe((data:string) =>{
      this.onContactPreferenceChange(data);
    });
    this.employeeForm.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.employeeForm);
    });
  }
  removeSkillButtonClick(skillIndex:number):void{
    (<FormArray>this.employeeForm.get('skills')).removeAt(skillIndex);
  }
  addSkillButtonClick():void{
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }
  addSkillFormGroup():FormGroup{
    return this.formBuilder.group({
      skillName : ['',Validators.required],
        experienceInYear : ['',[Validators.required,Validators.pattern(this.experiencePattern)]],
        proficiency : ['',Validators.required]
    });
  }
  onContactPreferenceChange(selectedValue:string){
    const emailGroup = this.employeeForm.get('emailGroup');
    const phoneGroup = this.employeeForm.get('phoneGroup');
    const emailControl = emailGroup.get('email');
    const confirmEmailControl = emailGroup.get('confirmEmail');
    const phoneControl = phoneGroup.get('phone');
    const confirmPhoneControl = phoneGroup.get('confirmPhone');
    if(selectedValue === 'phone'){
      this.show=false;
      phoneControl.setValidators([Validators.required,Validators.pattern(this.phonePattern)]);
      confirmPhoneControl.setValidators([Validators.required,Validators.pattern(this.phonePattern)]);
      emailControl.clearValidators();
      confirmEmailControl.clearValidators();
    }
    else{
      this.show=true;
      emailControl.setValidators([Validators.required,Validators.pattern(this.emailPattern)]);
      confirmEmailControl.setValidators([Validators.required,Validators.pattern(this.emailPattern)]);
      phoneControl.clearValidators();
      confirmPhoneControl.clearValidators();
    }
    emailControl.updateValueAndValidity();
    confirmEmailControl.updateValueAndValidity();
    phoneControl.updateValueAndValidity();
    confirmPhoneControl.updateValueAndValidity();
  }


  logValidationErrors(group:FormGroup = this.employeeForm):void{
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      
      this.formErrors[key] = '';
        if(abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)){
          const messages = this.validationMessages[key];
          for(const errorKey in abstractControl.errors){
            if(errorKey){
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
        if(abstractControl instanceof FormGroup){
          this.logValidationErrors(abstractControl);
        }
        /* if(abstractControl instanceof FormArray){
          for(const control of abstractControl.controls){
            if(control instanceof FormGroup){
              this.logValidationErrors(control);
            }
          }
        } */
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
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }
}

function matchEmail(gorup:AbstractControl):{[key:string]:any}|null{
  const emailControl = gorup.get('email');
  const confermEmailControl = gorup.get('confirmEmail');
  if(emailControl.value === confermEmailControl.value || confermEmailControl.pristine){
    return null;
  }else{
    return {'emailMismatch':true};
  }
}
function matchPhone(gorup:AbstractControl):{[key:string]:any}|null{
  const phoneControl = gorup.get('phone');
  const confermPhoneControl = gorup.get('confirmPhone');
  if(phoneControl.value === confermPhoneControl.value || confermPhoneControl.pristine){
    return null;
  }else{
    return {'phoneMismatch':true};
  }
}