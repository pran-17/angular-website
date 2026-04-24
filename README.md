# Attendance Portal - CMS Project

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+
- Angular CLI 16+

### Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   # or
   ng serve
   ```

3. **Build for production:**
   ```bash
   npm run build:prod
   ```

### Development Server

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Features

- **Attendance Module** - Monthly attendance upload and validation
  - Multi-step workflow
  - File upload (CSV, XLSX)
  - Data validation
  - Error reporting

### Available Commands

```bash
# Start development server
npm start

# Build project
npm run build

# Build for production
npm run build:prod

# Run unit tests
npm test

# Run linting
npm run lint
```

### Project Structure

```
src/
├── app/
│   ├── modules/
│   │   └── payroll/
│   │       ├── components/
│   │       │   └── attendance/
│   │       ├── services/
│   │       └── payroll.module.ts
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   └── app.component.ts
├── assets/
├── index.html
├── main.ts
└── styles.scss
```

### API Configuration

Update the API endpoint in `src/app/modules/payroll/services/attendance.service.ts`:

```typescript
private apiUrl = '/api/attendance'; // Update with your backend URL
```

### Troubleshooting

**Port 4200 already in use:**
```bash
ng serve --port 4300
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Clear Angular cache:**
```bash
ng cache clean
```

For more information, visit the [Angular documentation](https://angular.io/docs).
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/d253c24d-f250-488e-9717-1ccc7381331a" />

