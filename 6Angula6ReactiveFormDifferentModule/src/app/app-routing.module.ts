import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pageNotFound/page-not-found.component';
import { CustomPreloadingService } from './shared/custom-preloading.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'employees', data: { preload: false }, loadChildren: './employee/employee.module#EmployeeModule' },
  { path: '', redirectTo: '/home', pathMatch: "full" },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingService })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
