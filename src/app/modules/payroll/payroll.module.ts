import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PayrollRoutingModule } from './payroll-routing.module';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { AttendanceService } from './services/attendance.service';

@NgModule({
  declarations: [
    AttendanceComponent
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AttendanceService
  ]
})
export class PayrollModule { }
