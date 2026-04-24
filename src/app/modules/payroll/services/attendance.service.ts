import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface UploadResponse {
  validRecords: number;
  missingData: number;
  errors: number;
}

interface SubmitResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = '/api/attendance'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  /**
   * Download sample format for attendance upload
   */
  downloadSampleFormat(): void {
    const link = document.createElement('a');
    link.href = `${this.apiUrl}/download-sample`;
    link.download = 'attendance-sample.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Validate uploaded attendance file
   * @param formData FormData containing the file and form details
   * @returns Observable of UploadResponse with validation results
   */
  validateFile(formData: FormData): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.apiUrl}/validate`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Submit validated attendance data
   * @param formData FormData containing the file and form details
   * @returns Observable of SubmitResponse
   */
  submitAttendance(formData: FormData): Observable<SubmitResponse> {
    return this.http.post<SubmitResponse>(`${this.apiUrl}/submit`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Download error report
   */
  downloadErrorReport(): void {
    const link = document.createElement('a');
    link.href = `${this.apiUrl}/download-error-report`;
    link.download = 'attendance-errors.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Get upload history
   * @returns Observable of upload history data
   */
  getUploadHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   * @param error HttpErrorResponse
   * @returns Observable that throws error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('Attendance Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
