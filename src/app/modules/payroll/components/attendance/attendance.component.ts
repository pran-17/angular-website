import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';

interface UploadHistory {
  month: string;
  status: 'completed' | 'not-uploaded';
  date?: string;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  currentStep = 1;
  uploadedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;

  // Summary data
  totalStaff = 120;
  uploadedCount = 0;
  pendingCount = 120;
  lastUploadDate = 'Feb 2026';

  // Validation summary
  validRecords = 0;
  missingData = 0;
  errors = 0;

  // Upload history
  uploadHistory: UploadHistory[] = [
    { month: 'March 2026', status: 'not-uploaded' },
    { month: 'Feb 2026', status: 'completed', date: 'Feb 2026' },
    { month: 'Jan 2026', status: 'completed', date: 'Jan 2026' }
  ];

  institutions = [
    'E.G.S. Pillay Engineering College (AUTONOMOUS)',
    'Other Institution 1',
    'Other Institution 2'
  ];

  departments = [
    'All',
    'CSE',
    'ECE',
    'Mechanical',
    'Civil'
  ];

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService
  ) {
    this.attendanceForm = this.fb.group({
      institution: ['E.G.S. Pillay Engineering College (AUTONOMOUS)', Validators.required],
      department: ['All', Validators.required],
      monthYear: [this.getCurrentMonthYear(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.attendanceForm.valueChanges.subscribe(() => {
      this.resetForm();
    });
  }

  getCurrentMonthYear(): string {
    return `${this.months[this.currentMonth]} ${this.currentYear}`;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.uploadedFile = files[0];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.uploadedFile = event.dataTransfer.files[0];
    }
  }

  browseFile(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  downloadSampleFormat(): void {
    this.attendanceService.downloadSampleFormat();
  }

  uploadAndValidate(): void {
    if (!this.uploadedFile) {
      alert('Please select a file to upload');
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.uploadedFile);
    formData.append('institution', this.attendanceForm.get('institution')?.value);
    formData.append('department', this.attendanceForm.get('department')?.value);
    formData.append('monthYear', this.attendanceForm.get('monthYear')?.value);

    this.attendanceService.validateFile(formData).subscribe(
      (response: any) => {
        this.isUploading = false;
        this.validRecords = response.validRecords || 0;
        this.missingData = response.missingData || 0;
        this.errors = response.errors || 0;
        this.currentStep = 3;
      },
      (error) => {
        this.isUploading = false;
        alert('Error uploading file: ' + error.message);
      }
    );
  }

  submitFinal(): void {
    if (!this.uploadedFile) {
      alert('No file to submit');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFile);
    formData.append('institution', this.attendanceForm.get('institution')?.value);
    formData.append('department', this.attendanceForm.get('department')?.value);
    formData.append('monthYear', this.attendanceForm.get('monthYear')?.value);

    this.attendanceService.submitAttendance(formData).subscribe(
      (response: any) => {
        alert('Attendance submitted successfully');
        this.resetForm();
        this.currentStep = 1;
      },
      (error) => {
        alert('Error submitting attendance: ' + error.message);
      }
    );
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || step === 1) {
      this.currentStep = step;
    }
  }

  resetForm(): void {
    this.uploadedFile = null;
    this.validRecords = 0;
    this.missingData = 0;
    this.errors = 0;
    this.currentStep = 1;
    this.attendanceForm.reset({
      institution: 'E.G.S. Pillay Engineering College (AUTONOMOUS)',
      department: 'All',
      monthYear: this.getCurrentMonthYear()
    });
  }

  downloadErrorReport(): void {
    this.attendanceService.downloadErrorReport();
  }

  isStep1Valid(): boolean {
    return this.attendanceForm.valid && this.uploadedFile !== null;
  }

  isStep3Valid(): boolean {
    return this.validRecords > 0;
  }
}
