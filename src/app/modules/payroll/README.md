# Monthly Attendance Upload Component

## Overview
This is an Angular component for handling monthly attendance uploads in a payroll system. It provides a multi-step workflow for selecting context, uploading files, validating data, and submitting attendance records.

## Project Structure
```
src/app/modules/payroll/
├── components/
│   └── attendance/
│       ├── attendance.component.ts
│       ├── attendance.component.html
│       ├── attendance.component.scss
│       └── attendance.component.spec.ts
├── services/
│   ├── attendance.service.ts
│   └── attendance.service.spec.ts
├── payroll.module.ts
└── payroll-routing.module.ts
```

## Features

### 1. Context Selection
- Select Institution
- Select Department
- Choose Month & Year

### 2. File Upload
- Drag & Drop file upload
- Browse file selection
- Support for .xlsx and .csv formats
- Max file size: 5MB

### 3. Data Validation
- Validates attendance records
- Detects missing data
- Reports errors in a structured format
- Download error reports

### 4. Submission
- Multi-step form validation
- Payroll impact notification
- Upload history tracking
- Final confirmation before submission

## Installation

### 1. Module Setup
Import the `PayrollModule` in your main app module:

```typescript
import { PayrollModule } from './modules/payroll/payroll.module';

@NgModule({
  imports: [
    BrowserModule,
    PayrollModule
    // ... other imports
  ],
  // ...
})
export class AppModule { }
```

### 2. Routing Setup
Add the payroll route to your app routing:

```typescript
const routes: Routes = [
  {
    path: 'payroll',
    loadChildren: () => import('./modules/payroll/payroll.module').then(m => m.PayrollModule)
  },
  // ... other routes
];
```

### 3. API Integration
Configure the API endpoint in `AttendanceService`:

```typescript
private apiUrl = '/api/attendance'; // Replace with your actual endpoint
```

### 4. HTTP Module
Ensure `HttpClientModule` is imported in your app module:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    // ...
  ],
})
export class AppModule { }
```

## API Endpoints

The component expects the following API endpoints:

### 1. Validate File
- **Endpoint**: `POST /api/attendance/validate`
- **Request**: FormData (file, institution, department, monthYear)
- **Response**: 
```json
{
  "validRecords": 100,
  "missingData": 5,
  "errors": 2
}
```

### 2. Submit Attendance
- **Endpoint**: `POST /api/attendance/submit`
- **Request**: FormData (file, institution, department, monthYear)
- **Response**:
```json
{
  "success": true,
  "message": "Attendance submitted successfully"
}
```

### 3. Download Sample
- **Endpoint**: `GET /api/attendance/download-sample`
- **Response**: Excel file

### 4. Download Error Report
- **Endpoint**: `GET /api/attendance/download-error-report`
- **Response**: CSV file

### 5. Get Upload History
- **Endpoint**: `GET /api/attendance/history`
- **Response**:
```json
[
  {
    "month": "March 2026",
    "status": "not-uploaded",
    "date": null
  },
  {
    "month": "Feb 2026",
    "status": "completed",
    "date": "Feb 2026"
  }
]
```

## Component API

### Inputs
None (uses form inputs)

### Outputs
None (uses service calls)

### Public Methods

#### `uploadAndValidate()`
Uploads the selected file and validates the attendance data.

#### `submitFinal()`
Submits the validated attendance data.

#### `downloadSampleFormat()`
Downloads a sample attendance file template.

#### `downloadErrorReport()`
Downloads the validation error report.

#### `resetForm()`
Resets the form to initial state.

#### `goToStep(step: number)`
Navigates to a specific step in the workflow.

## Styling

The component uses SCSS with the following color scheme:
- **Primary**: `#1e3a8a` (Blue)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Secondary**: `#f3f4f6` (Light Gray)

### Responsive Design
The component is fully responsive and works on:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (below 768px)

## Testing

Run the unit tests:

```bash
# Run all tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run tests for specific component
ng test --include='**/attendance.component.spec.ts'
```

### Test Coverage
- Component initialization
- Form validation
- File upload handling
- Drag & drop functionality
- API calls
- Error handling
- Step navigation
- Form reset

## Usage Example

### In HTML
```html
<app-attendance></app-attendance>
```

### In TypeScript
```typescript
import { AttendanceComponent } from './modules/payroll/components/attendance/attendance.component';

@Component({
  selector: 'app-root',
  template: `<app-attendance></app-attendance>`
})
export class AppComponent { }
```

## Error Handling

The component provides:
- File validation (size, format)
- Form field validation
- HTTP error handling with user-friendly messages
- Validation summary with detailed error counts

## Performance Considerations

1. **Large Files**: Implement chunked file uploads for files > 5MB
2. **Caching**: Consider caching upload history and sample format
3. **Lazy Loading**: Module is designed for lazy loading
4. **Change Detection**: Component uses OnPush strategy (recommended)

## Future Enhancements

1. Add batch upload for multiple months
2. Implement real-time file preview
3. Add undo/redo functionality
4. Support for additional file formats (JSON, XML)
5. Advanced filtering and search in upload history
6. Integration with payment processing workflows

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Angular 12+ (or specify your version)
- RxJS 6+
- Bootstrap 4+ (optional, for utility classes)

## License

MIT License

## Support

For issues or feature requests, please create an issue in the project repository.
