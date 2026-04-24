/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AttendanceComponent } from './attendance.component';
import { AttendanceService } from '../../services/attendance.service';
import { of, throwError } from 'rxjs';

describe('AttendanceComponent', () => {
  let component: AttendanceComponent;
  let fixture: ComponentFixture<AttendanceComponent>;
  let mockAttendanceService: jasmine.SpyObj<AttendanceService>;

  beforeEach(async () => {
    mockAttendanceService = jasmine.createSpyObj('AttendanceService', [
      'downloadSampleFormat',
      'validateFile',
      'submitAttendance',
      'downloadErrorReport'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AttendanceComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AttendanceService, useValue: mockAttendanceService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.attendanceForm.get('institution')?.value).toBe('E.G.S. Pillay Engineering College (AUTONOMOUS)');
    expect(component.attendanceForm.get('department')?.value).toBe('All');
  });

  it('should set uploaded file on file selection', () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.ms-excel' });
    const event = {
      target: {
        files: [mockFile]
      }
    } as any;

    component.onFileSelected(event);
    expect(component.uploadedFile).toBe(mockFile);
  });

  it('should set uploaded file on drop event', () => {
    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
    const event = {
      dataTransfer: {
        files: [mockFile]
      },
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation')
    } as any;

    component.onDrop(event);
    expect(component.uploadedFile).toBe(mockFile);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle drag over event', () => {
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation')
    } as any;

    component.onDragOver(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should call attendance service download sample format', () => {
    component.downloadSampleFormat();
    expect(mockAttendanceService.downloadSampleFormat).toHaveBeenCalled();
  });

  it('should upload and validate file successfully', () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.ms-excel' });
    component.uploadedFile = mockFile;
    mockAttendanceService.validateFile.and.returnValue(of({
      validRecords: 100,
      missingData: 5,
      errors: 2
    }));

    component.uploadAndValidate();

    expect(mockAttendanceService.validateFile).toHaveBeenCalled();
    expect(component.validRecords).toBe(100);
    expect(component.missingData).toBe(5);
    expect(component.errors).toBe(2);
    expect(component.currentStep).toBe(3);
  });

  it('should handle upload validation error', () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.ms-excel' });
    component.uploadedFile = mockFile;
    mockAttendanceService.validateFile.and.returnValue(throwError(() => new Error('Upload failed')));

    spyOn(window, 'alert');
    component.uploadAndValidate();

    expect(component.isUploading).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Error uploading file: Upload failed');
  });

  it('should submit attendance successfully', () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.ms-excel' });
    component.uploadedFile = mockFile;
    mockAttendanceService.submitAttendance.and.returnValue(of({
      success: true,
      message: 'Attendance submitted successfully'
    }));

    spyOn(window, 'alert');
    component.submitFinal();

    expect(mockAttendanceService.submitAttendance).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Attendance submitted successfully');
  });

  it('should go to previous step', () => {
    component.currentStep = 3;
    component.goToStep(1);
    expect(component.currentStep).toBe(1);
  });

  it('should not go forward without completing current step', () => {
    component.currentStep = 1;
    component.goToStep(3);
    expect(component.currentStep).toBe(1);
  });

  it('should validate step 1 completion', () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.ms-excel' });
    component.uploadedFile = mockFile;

    expect(component.isStep1Valid()).toBe(true);

    component.uploadedFile = null;
    expect(component.isStep1Valid()).toBe(false);
  });

  it('should validate step 3 completion', () => {
    component.validRecords = 100;
    expect(component.isStep3Valid()).toBe(true);

    component.validRecords = 0;
    expect(component.isStep3Valid()).toBe(false);
  });

  it('should reset form', () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.ms-excel' });
    component.uploadedFile = mockFile;
    component.validRecords = 100;
    component.currentStep = 3;

    component.resetForm();

    expect(component.uploadedFile).toBeNull();
    expect(component.validRecords).toBe(0);
    expect(component.currentStep).toBe(1);
  });

  it('should call download error report', () => {
    component.downloadErrorReport();
    expect(mockAttendanceService.downloadErrorReport).toHaveBeenCalled();
  });
});
