import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './components/attendance/attendance.component';

const routes: Routes = [
  {
    path: 'attendance',
    component: AttendanceComponent,
    data: { title: 'Monthly Attendance Upload' }
  },
  {
    path: '',
    redirectTo: 'attendance',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
