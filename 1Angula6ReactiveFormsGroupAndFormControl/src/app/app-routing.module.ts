import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeComponent } from './employee/list-employee/list-employee.component';
import { HomeComponent } from './home/home.component';
import { CreateEmployeeComponent } from './employee/create-employee/create-employee.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'list',component:ListEmployeeComponent},
  {path:'create',component:CreateEmployeeComponent},
  {path:'',redirectTo:'/home',pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
