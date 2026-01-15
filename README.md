# PDF/DOC Editor Application

A full-stack web application for creating, editing, and managing PDF and Word documents. Built with Angular 21 (frontend) and Spring Boot 3.x (backend).

## Features

✅ **Document Management**
- Create new documents
- Upload PDF and DOCX files
- Edit document content
- Delete documents
- View document list with metadata

✅ **File Operations**
- Export documents as PDF
- Export documents as DOCX
- Support for multiple document formats

✅ **User Interface**
- Clean, modern, responsive design
- Real-time content editing
- Error handling and user feedback
- Loading states and notifications

## Architecture

### Frontend (Angular)
- **Framework**: Angular 21 (Standalone Components)
- **State Management**: RxJS + Signals
- **HTTP Client**: Angular HttpClient
- **Styling**: SCSS

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Database**: PostgreSQL (production) / H2 (development)
- **PDF Processing**: iText
- **Word Processing**: Apache POI
- **REST API**: Spring Web

## Project Structure

```
pdf-editor/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── documents/          # Documents list & upload
│   │   │   │   ├── documents.component.ts
│   │   │   │   ├── documents.component.html
│   │   │   │   └── documents.component.scss
│   │   │   └── editor/             # Document editor
│   │   │       ├── editor.component.ts
│   │   │       ├── editor.component.html
│   │   │       └── editor.component.scss
│   │   ├── services/
│   │   │   └── document.service.ts # API communication
│   │   ├── app.ts                  # Root component
│   │   ├── app.routes.ts           # Routing configuration
│   │   └── app.config.ts           # Application config
│   ├── main.ts
│   └── styles.scss
├── public/
├── angular.json
├── package.json
├── tsconfig.json
├── SPRING_BOOT_SETUP.md            # Backend setup guide
└── README.md
```

## Prerequisites

### Frontend
- Node.js 18+ and npm 9+
- Angular CLI 21+

### Backend
- Java 17+
- Maven 3.8+
- PostgreSQL 12+ (or use H2 for development)

## Quick Start

### 1. Frontend Setup

```bash
# Navigate to project directory
cd pdf-editor

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:4200`

### 2. Backend Setup

Follow the comprehensive guide in [SPRING_BOOT_SETUP.md](SPRING_BOOT_SETUP.md)

```bash
# Create new Spring Boot project
spring boot new pdf-editor-backend --build=maven

# Copy the service, controller, model, and config files from the guide
# Update application.properties with your database credentials
# Run the application
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080/api`

## API Endpoints

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | Get all documents |
| GET | `/api/documents/{id}` | Get specific document |
| POST | `/api/documents` | Create new document |
| PUT | `/api/documents/{id}` | Update document content |
| DELETE | `/api/documents/{id}` | Delete document |
| POST | `/api/documents/upload` | Upload file (PDF/DOCX) |
| GET | `/api/documents/{id}/export/pdf` | Export as PDF |
| GET | `/api/documents/{id}/export/docx` | Export as DOCX |

## Key Components

### DocumentService
Handles all API communication with the backend. Provides methods for:
- Fetching documents
- Creating/updating documents
- Uploading files
- Exporting documents
- Managing current document state

### DocumentsComponent
Lists all documents with:
- Document table with metadata
- Upload form for new documents
- Edit and delete actions
- File type indicators

### EditorComponent
Full document editing interface with:
- Text area for content editing
- Save functionality
- Export options (PDF/DOCX)
- Loading and error states
- Navigation

## Development

### Building for Production

```bash
# Build Angular application
ng build --configuration production

# Build Spring Boot application
mvn clean package

# Run JAR file
java -jar target/pdf-editor-backend.jar
```

### Running Tests

```bash
# Angular tests
npm test

# Spring Boot tests
mvn test
```

## Configuration

### Angular Configuration
Edit `src/environments/environment.ts` to change API base URL:
```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api'
};
```

### Spring Boot Configuration
Edit `src/main/resources/application.properties`:
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/pdf_editor
```

## Dependencies

### Frontend
- `@angular/core` - Core Angular framework
- `@angular/common` - Common utilities
- `@angular/forms` - Form handling
- `@angular/router` - Client-side routing
- `rxjs` - Reactive programming
- `pdfjs-dist` - PDF viewing
- `pdf-lib` - PDF manipulation
- `mammoth` - DOCX reading
- `docx` - DOCX creation

### Backend
- `spring-boot-starter-web` - Web framework
- `spring-boot-starter-data-jpa` - ORM
- `postgresql` - Database driver
- `itextpdf` - PDF processing
- `poi-ooxml` - Word document processing
- `lombok` - Reduce boilerplate

## Troubleshooting

### CORS Issues
- Ensure backend CORS configuration includes frontend URL
- Check browser console for specific error messages

### PDF/DOCX Not Loading
- Verify backend is running on port 8080
- Check API endpoint in DocumentService
- Ensure file permissions in database

### File Upload Fails
- Check multipart.max-file-size in application.properties
- Verify storage directory has write permissions
- Check file format is supported (PDF or DOCX)

## Performance Optimization

1. **Frontend**:
   - Lazy load components
   - Implement OnPush change detection
   - Use trackBy in *ngFor loops

2. **Backend**:
   - Add pagination for document list
   - Implement caching for frequently accessed documents
   - Use database indexing on ID fields

## Security Considerations

1. **Authentication**: Add Spring Security with JWT tokens
2. **Authorization**: Implement document-level access control
3. **Encryption**: Encrypt sensitive data at rest
4. **Validation**: Validate all file uploads
5. **HTTPS**: Use HTTPS in production

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Document versioning and history
- [ ] Collaborative editing with WebSockets
- [ ] Rich text editor integration
- [ ] Advanced PDF features (annotations, forms)
- [ ] OCR support for scanned documents
- [ ] Document search functionality
- [ ] Batch operations
- [ ] Cloud storage integration
- [ ] Mobile app support

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the SPRING_BOOT_SETUP.md guide
3. Check browser console for errors
4. Review Spring Boot logs for backend issues

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using Angular and Spring Boot

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
