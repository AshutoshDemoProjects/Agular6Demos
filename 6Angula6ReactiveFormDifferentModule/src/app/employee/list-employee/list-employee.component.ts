import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../IEmployee';
@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
  employees: IEmployee[];
  constructor(private _employeeService: EmployeeService,
    private _router: Router) { }

  ngOnInit() {
    this._employeeService.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees,
      (err) => console.log(err)
    );
  }
  editBtnClick(empId: number) {
    this._router.navigate(['/employees/edit', empId]);
  }
}
