import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'payroll',
    loadChildren: () => import('./modules/payroll/payroll.module').then(m => m.PayrollModule)
  },
  {
    path: '',
    redirectTo: 'payroll',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'payroll'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
