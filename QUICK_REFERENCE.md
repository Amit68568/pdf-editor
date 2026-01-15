# Quick Reference Guide

## Start Development Servers

### Terminal 1 - Frontend (Angular)
```bash
cd pdf-editor
npm install  # First time only
npm start
# Opens http://localhost:4200
```

### Terminal 2 - Backend (Spring Boot)
```bash
cd pdf-editor-backend
mvn spring-boot:run
# API available at http://localhost:8080/api
```

---

## Project Structure Overview

### Frontend
```
src/
├── app/
│   ├── components/
│   │   ├── documents/      # List & upload documents
│   │   └── editor/         # Edit documents
│   ├── services/
│   │   └── document.service.ts  # API calls
│   ├── app.routes.ts       # URL routing
│   └── app.config.ts       # App configuration
├── main.ts
└── styles.scss
```

### Backend
```
src/main/java/com/example/pdfeditor/
├── model/          # Data entities (Document, DocumentType)
├── repository/     # Database access
├── service/        # Business logic
├── controller/     # REST API endpoints
└── config/         # Configuration classes
```

---

## Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/documents` | List all documents |
| POST | `/api/documents` | Create document |
| GET | `/api/documents/{id}` | Get specific document |
| PUT | `/api/documents/{id}` | Update document |
| DELETE | `/api/documents/{id}` | Delete document |
| POST | `/api/documents/upload` | Upload file |
| GET | `/api/documents/{id}/export/pdf` | Export as PDF |
| GET | `/api/documents/{id}/export/docx` | Export as DOCX |

---

## Technologies Used

### Frontend
- **Angular 21** - UI framework
- **TypeScript** - Programming language
- **SCSS** - Styling
- **RxJS** - Reactive programming
- **PDF Libraries** - PDF handling (pdfjs-dist, pdf-lib, mammoth, docx)

### Backend
- **Spring Boot 3.x** - Framework
- **Java 17** - Language
- **PostgreSQL/H2** - Database
- **iText** - PDF processing
- **Apache POI** - Word document processing

---

## Important Files

### Frontend Configuration
- `package.json` - Dependencies and npm scripts
- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript settings

### Backend Configuration
- `pom.xml` - Maven dependencies
- `application.properties` - Runtime settings
- `PdfEditorApplication.java` - Entry point

---

## Common Tasks

### Add a New Feature

1. **Frontend**:
   ```bash
   ng generate component components/feature-name
   ng generate service services/feature-service
   ```

2. **Backend**:
   - Create model class in `model/`
   - Create repository in `repository/`
   - Create service in `service/`
   - Create controller in `controller/`

### Build for Production

Frontend:
```bash
ng build --configuration production
```

Backend:
```bash
mvn clean package
```

### Run Tests

Frontend:
```bash
npm test
```

Backend:
```bash
mvn test
```

---

## Environment Setup

### Change API URL (Frontend)
Edit `src/app/services/document.service.ts`:
```typescript
private apiUrl = 'http://your-backend-url/api/documents';
```

### Change Backend Port
Edit `src/main/resources/application.properties`:
```properties
server.port=9090  # Change from 8080 to 9090
```

### Change Database (Backend)
Development (H2):
```properties
spring.datasource.url=jdbc:h2:mem:testdb
```

Production (PostgreSQL):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pdf_editor
spring.datasource.username=postgres
spring.datasource.password=password
```

---

## Debugging

### Frontend (Browser DevTools)
1. F12 or Ctrl+Shift+I
2. Go to Console tab
3. Check for errors
4. Use Angular DevTools extension

### Backend (Spring Boot Logs)
Check console output for:
- Application startup messages
- HTTP request logs
- Database connection info
- Error stack traces

Enable debug logging:
```properties
logging.level.root=INFO
logging.level.com.example.pdfeditor=DEBUG
```

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Angular App | 4200 | http://localhost:4200 |
| Spring Boot API | 8080 | http://localhost:8080 |
| H2 Console | 8080 | http://localhost:8080/h2-console |
| PostgreSQL | 5432 | localhost:5432 |

---

## File Upload Requirements

- **PDF Files**: `.pdf` (max 10MB by default)
- **Word Files**: `.doc`, `.docx` (max 10MB by default)

To change max file size:
```properties
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

---

## Next Steps

1. ✅ Set up both frontend and backend
2. ✅ Verify both servers are running
3. 📝 Test document creation and editing
4. 📝 Test file upload
5. 📝 Test export to PDF/DOCX
6. 🔒 Add authentication (Spring Security)
7. 🔒 Add authorization (document access control)
8. 🚀 Deploy to production

---

## Documentation Files

- `README.md` - Project overview and setup
- `DEVELOPMENT_SETUP.md` - Detailed development guide
- `SPRING_BOOT_SETUP.md` - Detailed backend implementation
- `QUICK_REFERENCE.md` - This file

---

## Useful Commands

```bash
# Frontend
npm start          # Start dev server
npm test           # Run tests
ng build           # Build for production
ng serve --port 4300  # Different port

# Backend
mvn spring-boot:run    # Start application
mvn test               # Run tests
mvn clean package      # Build JAR
mvn spotless:apply     # Format code

# Database (PostgreSQL)
psql -U postgres
createdb pdf_editor
dropdb pdf_editor
```

---

## Getting Help

1. Check browser console (Frontend)
2. Check Spring Boot console output (Backend)
3. Review error messages in logs
4. Check `DEVELOPMENT_SETUP.md` troubleshooting section
5. Review `SPRING_BOOT_SETUP.md` for backend details

---

Happy coding! 🎉
