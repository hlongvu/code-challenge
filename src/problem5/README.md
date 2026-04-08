# ExpressJS CRUD API with TypeScript and SQLite

A backend server built with ExpressJS and TypeScript that provides CRUD operations for managing resources with SQLite database persistence.

## Features

- **Create**: Add new resources with name, description, category, and status
- **List**: Get all resources with optional filters (category, status, search)
- **Read**: Get details of a specific resource by ID
- **Update**: Modify existing resource details
- **Delete**: Remove resources from the database

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Configuration

The application uses the following environment variables (all optional):

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |

You can create a `.env` file in the root directory or set environment variables directly.

## Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/resources
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resources` | Create a new resource |
| `GET` | `/api/resources` | List all resources (with optional filters) |
| `GET` | `/api/resources/:id` | Get a specific resource by ID |
| `PUT` | `/api/resources/:id` | Update a resource by ID |
| `DELETE` | `/api/resources/:id` | Delete a resource by ID |

### Health Check
```
GET http://localhost:3000/health
```

## Request/Response Examples

### Create a Resource
```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Resource",
    "description": "This is a sample resource description",
    "category": "general",
    "status": "active"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": 1,
    "name": "Sample Resource",
    "description": "This is a sample resource description",
    "category": "general",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### List Resources
```bash
curl http://localhost:3000/api/resources
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### List Resources with Filters
```bash
# Filter by category
curl "http://localhost:3000/api/resources?category=general"

# Filter by status
curl "http://localhost:3000/api/resources?status=active"

# Search by name or description
curl "http://localhost:3000/api/resources?search=sample"

# Combine filters
curl "http://localhost:3000/api/resources?category=general&status=active"
```

### Get Resource Details
```bash
curl http://localhost:3000/api/resources/1
```

### Update Resource
```bash
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Resource Name",
    "status": "inactive"
  }'
```

### Delete Resource
```bash
curl -X DELETE http://localhost:3000/api/resources/1
```

## Data Model

### Resource

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-generated primary key |
| `name` | string | Resource name (required) |
| `description` | string | Resource description |
| `category` | string | Resource category |
| `status` | string | Resource status: `active` or `inactive` |
| `created_at` | datetime | Creation timestamp |
| `updated_at` | datetime | Last update timestamp |

## Project Structure

The project follows a layered architecture pattern:

```
.
├── src/
│   ├── index.ts                   # Main application entry point
│   ├── database.ts                # Database configuration and initialization
│   ├── types.ts                   # TypeScript type definitions
│   ├── controllers/
│   │   └── resourceController.ts  # HTTP request handlers
│   ├── services/
│   │   └── resourceService.ts     # Business logic & database operations
│   └── routes/
│       ├── index.ts               # Route aggregator
│       └── resources.ts           # Resource route definitions
├── dist/                          # Compiled JavaScript (generated after build)
├── database.sqlite                # SQLite database file (created automatically)
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

### Architecture Layers

1. **Routes** (`routes/`): Define API endpoints and map them to controller methods
2. **Controllers** (`controllers/`): Handle HTTP requests/responses, validation, and error handling
3. **Services** (`services/`): Contain business logic and database operations
4. **Database** (`database.ts`): Database connection and initialization

## Database

The application uses SQLite for data persistence. The database file (`database.sqlite`) is created automatically when the server starts for the first time. The `resources` table is also created automatically if it doesn't exist.

## Error Handling

All API responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## License

ISC
