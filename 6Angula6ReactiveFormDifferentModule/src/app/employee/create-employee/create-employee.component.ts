import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';

import { EmployeeService } from '../employee.service';
import { IEmployee } from '../IEmployee';
import { ISkills } from '../ISkills';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: String;
  btnText: string;

  emailPattern = "^([a-zA-Z0-9_\.]+)@([a-zA-Z0-9_\.]+)\.([a-zA-Z]{2,5})$";
  experiencePattern = "^[0-9]{1,2}$";
  phonePattern = "^[7-9]{1}[0-9]{7,9}";
  validationMessages = {
    'fullName': {
      'required': 'Full name is required.',
      'minlength': 'Full name be greater than 2 characters.',
      'maxlength': 'Full name be less than 20 characters.'
    },
    'emailGroup': {
      'emailMismatch': 'Email and conferm email fild must have same value.'
    },
    'email': {
      'required': 'Email is required.',
      'pattern': 'please enter valid email address.'
    },
    'confirmEmail': {
      'required': 'Confirm email is required.',
      'pattern': 'please enter valid email address.'
    },
    'phoneGroup': {
      'phoneMismatch': 'Phone and conferm phone fild must have same value.'
    },
    'phone': {
      'required': 'Phone number is required.',
      'pattern': 'please enter valid phone number.'
    },
    'confirmPhone': {
      'required': 'Confirm phone number is required.',
      'pattern': 'please enter valid confirm phone number.'
    }
  };

  formErrors = {};
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      contactPreference: ['email'],
      emailGroup: this.formBuilder.group({
        email: [''],
        confirmEmail: [''],
      }, { validator: matchEmail }),
      phoneGroup: this.formBuilder.group({
        phone: [''],
        confirmPhone: [''],
      }, { validator: matchPhone }),
      skills: this.formBuilder.array([
        this.addSkillFormGroup()
      ])
    });
    this.onContactPreferenceChange('email');
    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });
    this.route.paramMap.subscribe((params) => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = "Edit";
        this.btnText = "Update";
        this.getEmployee(empId);
      } else {
        this.pageTitle = "Create";
        this.btnText = "Save";
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
  }
  getEmployee(empId: number) {
    this.employeeService.getEmployee(empId).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (err: any) => console.log(err)
    );
  }
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email,
      },
      phoneGroup: {
        phone: employee.phone,
        confirmPhone: employee.phone,
      },
    });
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }
  setExistingSkills(skillSets: ISkills[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach((s) => {
      formArray.push(this.formBuilder.group({
        skillName: s.skillName,
        experienceInYear: s.experienceInYear,
        proficiency: s.proficiency
      }));
    });
    return formArray;
  }
  removeSkillButtonClick(skillIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }
  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }
  addSkillFormGroup(): FormGroup {
    return this.formBuilder.group({
      skillName: ['', Validators.required],
      experienceInYear: ['', [Validators.required, Validators.pattern(this.experiencePattern)]],
      proficiency: ['', Validators.required]
    });
  }
  onContactPreferenceChange(selectedValue: string) {
    const emailGroup = this.employeeForm.get('emailGroup');
    const phoneGroup = this.employeeForm.get('phoneGroup');
    const emailControl = emailGroup.get('email');
    const confirmEmailControl = emailGroup.get('confirmEmail');
    const phoneControl = phoneGroup.get('phone');
    const confirmPhoneControl = phoneGroup.get('confirmPhone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators([Validators.required, Validators.pattern(this.phonePattern)]);
      confirmPhoneControl.setValidators([Validators.required, Validators.pattern(this.phonePattern)]);
      emailControl.clearValidators();
      confirmEmailControl.clearValidators();
    }
    else {
      emailControl.setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
      confirmEmailControl.setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
      phoneControl.clearValidators();
      confirmPhoneControl.clearValidators();
    }
    emailControl.updateValueAndValidity();
    confirmEmailControl.updateValueAndValidity();
    phoneControl.updateValueAndValidity();
    confirmPhoneControl.updateValueAndValidity();
  }


  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

    });
  }
  onLoadDataClick(): void {
    //This method is used when some parth of form controll are set
    this.employeeForm.patchValue({
      fullName: 'Ashutosh Sonawane',
      email: 'Ashutosh@sonawane.co',

    });

  }
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    }
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }
  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phoneGroup.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }
}
function matchEmail(gorup: AbstractControl): { [key: string]: any } | null {
  const emailControl = gorup.get('email');
  const confermEmailControl = gorup.get('confirmEmail');
  if (emailControl.value === confermEmailControl.value
    || (confermEmailControl.pristine && confermEmailControl.value === '')) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}
function matchPhone(gorup: AbstractControl): { [key: string]: any } | null {
  const phoneControl = gorup.get('phone');
  const confermPhoneControl = gorup.get('confirmPhone');
  if (phoneControl.value === confermPhoneControl.value
    || (confermPhoneControl.pristine && confermPhoneControl.value === '')) {
    return null;
  } else {
    return { 'phoneMismatch': true };
  }
}