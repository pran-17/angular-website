/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AttendanceService } from './attendance.service';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AttendanceService]
    });
    service = TestBed.inject(AttendanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate file', () => {
    const mockResponse = {
      validRecords: 100,
      missingData: 5,
      errors: 2
    };

    const formData = new FormData();
    formData.append('file', new File(['test'], 'test.xlsx'));

    service.validateFile(formData).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/attendance/validate');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should submit attendance', () => {
    const mockResponse = {
      success: true,
      message: 'Attendance submitted successfully'
    };

    const formData = new FormData();
    formData.append('file', new File(['test'], 'test.xlsx'));

    service.submitAttendance(formData).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/attendance/submit');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get upload history', () => {
    const mockHistory = [
      { month: 'March 2026', status: 'not-uploaded' },
      { month: 'Feb 2026', status: 'completed' },
      { month: 'Jan 2026', status: 'completed' }
    ];

    service.getUploadHistory().subscribe(result => {
      expect(result).toEqual(mockHistory);
    });

    const req = httpMock.expectOne('/api/attendance/history');
    expect(req.request.method).toBe('GET');
    req.flush(mockHistory);
  });

  it('should handle error response', () => {
    const formData = new FormData();
    formData.append('file', new File(['test'], 'test.xlsx'));

    service.validateFile(formData).subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error.message).toContain('Error Code');
      }
    );

    const req = httpMock.expectOne('/api/attendance/validate');
    req.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Server Error' }
    );
  });

  it('should download sample format', () => {
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(document, 'createElement').and.returnValue(document.createElement('a'));

    service.downloadSampleFormat();

    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  it('should download error report', () => {
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(document, 'createElement').and.returnValue(document.createElement('a'));

    service.downloadErrorReport();

    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });
});
