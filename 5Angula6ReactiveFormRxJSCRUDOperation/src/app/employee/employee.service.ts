import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';

import { IEmployee } from './IEmployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private httpClient : HttpClient) { }
  baseUrl = 'http://localhost:3000/employees';
  
  //To get All Employees in RestAPI
  getEmployees():Observable<IEmployee[]>{
    return this.httpClient.get<IEmployee[]>(this.baseUrl).pipe(catchError(this.handleError));
  }
  
  //
  //To get Employee by id from RestAPI
  getEmployee(id:number):Observable<IEmployee>{
    return this.httpClient.get<IEmployee>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }
  
  //To add Employee in RestAPI
  addEmployee(employee:IEmployee):Observable<IEmployee>{
    console.log('service empolyee :\nName'+employee.fullName);
    console.log('email'+employee.email);
    console.log('skills'+employee.skills[0].skillName);
    return this.httpClient.post<IEmployee>(this.baseUrl,employee,{
      headers:new HttpHeaders({'Content-Type':'application/json'})
    }).pipe(catchError(this.handleError));
  }

  //To update Employee in RestAPI
  updateEmployee(employee : IEmployee) : Observable<void>{
    return this.httpClient.put<void>(`${this.baseUrl}/${employee.id}`,employee,{
      headers:new HttpHeaders({'Content-Type':'application/json'})}).pipe(catchError(this.handleError));
  }

  //To delete Employee from RestAPI
  deleteEmployee(employee : IEmployee) : Observable<void>{
    return this.httpClient.delete<void>(`${this.baseUrl}/${employee.id}`).pipe(catchError(this.handleError));
  }
  private handleError(errorResponse : HttpErrorResponse){
    if(errorResponse.error instanceof ErrorEvent){
      console.log('Client side error : ',errorResponse.error);
    }else{
      console.log('Server side error : ', errorResponse);
    }
    return throwError('There is a problem with the service');
  }
}
