import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';

interface UploadHistory {
  month: string;
  status: 'completed' | 'warning' | 'not-uploaded';
  date?: string;
  user?: string;
  filename?: string;
  size?: string;
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
  private uploadTimer: number | null = null;

  // Summary data
  totalStaff = 120;
  uploadedCount = 0;
  pendingCount = 120;
  lastUploadDate = 'Feb 2026';

  // Validation summary
  validRecords = 0;
  missingData = 0;
  errors = 0;
  duplicateRecords = 2;
  invalidEntries = 1;
  lateArrivals = 4;
  overtimeHours = 18.5;

  // Upload history
  uploadHistory: UploadHistory[] = [
    {
      month: 'March 2026',
      status: 'not-uploaded',
      user: 'HR Ops',
      filename: 'No file uploaded',
      size: '—'
    },
    {
      month: 'Feb 2026',
      status: 'completed',
      date: 'Feb 26, 2026 09:30',
      user: 'Anjali Rao',
      filename: 'attendance_feb.csv',
      size: '1.8 MB'
    },
    {
      month: 'Jan 2026',
      status: 'warning',
      date: 'Jan 28, 2026 11:15',
      user: 'Ravi M.',
      filename: 'attendance_jan.xlsx',
      size: '2.1 MB'
    }
  ];

  summaryMetrics = [
    { label: 'Upload Success Rate', value: '98.4%', trend: '↑ 2.4%', tone: 'positive', icon: '📈' },
    { label: 'Pending Departments', value: '4', trend: '↓ 1', tone: 'neutral', icon: '🗂️' },
    { label: 'Attendance Completion %', value: '92%', trend: '↑ 5%', tone: 'positive', icon: '✅' },
    { label: 'Payroll Readiness %', value: '87%', trend: '↑ 3%', tone: 'positive', icon: '💳' }
  ];

  previewStats = [
    { label: 'Total Present', value: '114', tone: 'positive' },
    { label: 'Total Absent', value: '6', tone: 'warning' },
    { label: 'Leave Count', value: '2', tone: 'neutral' },
    { label: 'Holiday Count', value: '1', tone: 'neutral' },
    { label: 'Late Arrivals', value: '4', tone: 'warning' },
    { label: 'Overtime Hours', value: '18.5', tone: 'positive' },
    { label: 'Duplicate Records', value: '2', tone: 'danger' },
    { label: 'Invalid Entries', value: '1', tone: 'danger' }
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
    this.uploadProgress = 12;
    this.startUploadProgress();

    const formData = new FormData();
    formData.append('file', this.uploadedFile);
    formData.append('institution', this.attendanceForm.get('institution')?.value);
    formData.append('department', this.attendanceForm.get('department')?.value);
    formData.append('monthYear', this.attendanceForm.get('monthYear')?.value);

    this.attendanceService.validateFile(formData).subscribe(
      (response: any) => {
        this.stopUploadProgress();
        this.isUploading = false;
        this.uploadProgress = 100;
        this.validRecords = response.validRecords || 0;
        this.missingData = response.missingData || 0;
        this.errors = response.errors || 0;
        this.currentStep = 3;
      },
      (error) => {
        this.stopUploadProgress();
        this.isUploading = false;
        this.uploadProgress = 0;
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
    this.stopUploadProgress();
    this.uploadedFile = null;
    this.uploadProgress = 0;
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

  getFileSize(file: File | null): string {
    if (!file) {
      return '0 KB';
    }

    const sizeInKb = Math.round(file.size / 1024);
    if (sizeInKb < 1024) {
      return `${sizeInKb} KB`;
    }

    return `${(sizeInKb / 1024).toFixed(1)} MB`;
  }

  getStatusClass(status: string): string {
    return status === 'completed' ? 'completed' : status === 'warning' ? 'warning' : 'pending';
  }

  private startUploadProgress(): void {
    this.stopUploadProgress();
    this.uploadTimer = window.setInterval(() => {
      this.uploadProgress = Math.min(this.uploadProgress + Math.floor(Math.random() * 11) + 5, 92);
    }, 180);
  }

  private stopUploadProgress(): void {
    if (this.uploadTimer !== null) {
      window.clearInterval(this.uploadTimer);
      this.uploadTimer = null;
    }
  }
}
