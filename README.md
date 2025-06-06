# Quotation Management System

A full-featured Windows OS-inspired quotation management application built with React, TypeScript, Node.js, and supports both SQLite and PostgreSQL databases.

## Features

### 🖥️ Windows-Inspired UI

- Desktop environment with taskbar and start menu
- Windowed applications with minimize, maximize, and close functionality
- Multiple apps running simultaneously

### 📋 Quotation Management

- Create, edit, and delete quotations
- Add multiple items to quotations
- Automatic calculation of subtotals, taxes, and totals
- Quotation status tracking (Draft, Pending, Sent, Approved, Rejected)
- Duplicate quotations
- Export quotations (PDF, Excel)

### 👥 Client Management

- Complete client database with contact information
- Client history and quotation tracking
- Search and filter clients

### 📦 Product & Service Management

- Manage products, services, and subscriptions
- Inventory tracking for physical products
- Pricing and tax configuration
- Product categories and search

### 🎨 Template System

- Pre-designed quotation templates
- Custom template creation
- Template categories and thumbnails

### 📊 Reporting & Analytics

- Sales reports and analytics
- Client performance metrics
- Revenue tracking
- Export capabilities

## Technology Stack

### Frontend

- **React 18** with TypeScript
- **HeroUI** for modern UI components
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Axios** for API communication

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** for database management
- **Zod** for data validation
- **CORS, Helmet, Compression** for security and performance

### Database

- **SQLite** (default for development)
- **PostgreSQL** (production ready)
- Database migrations and seeding
- Automatic schema generation

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quotation-web-app
   ```

2. **Install dependencies**

   ```bash
   npm run setup
   ```

3. **Set up the database**

   ```bash
   # Copy environment files
   cp .env.example .env
   cp server/.env.example server/.env

   # Generate Prisma client and run migrations
   cd server
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   cd ..
   ```

4. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

## Database Configuration

### SQLite (Default)

The application uses SQLite by default for easy development setup. No additional configuration required.

### PostgreSQL (Production)

To use PostgreSQL:

1. **Start PostgreSQL with Docker**

   ```bash
   docker-compose up postgres -d
   ```

2. **Update server/.env**

   ```env
   DATABASE_PROVIDER="postgresql"
   DATABASE_URL="postgresql://quotation_user:quotation_password@localhost:5432/quotation_db"
   ```

3. **Run migrations**
   ```bash
   cd server
   npm run db:migrate
   npm run db:seed
   ```

## Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run setup` - Install all dependencies
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database with sample data

### Frontend (Client)

- `npm run client:dev` - Start frontend development server
- `npm run client:build` - Build frontend for production

### Backend (Server)

- `npm run server:dev` - Start backend development server
- `npm run server:build` - Build backend for production

## API Documentation

The API follows RESTful conventions and includes the following endpoints:

### Clients

- `GET /api/v1/clients` - Get all clients
- `GET /api/v1/clients/:id` - Get client by ID
- `POST /api/v1/clients` - Create new client
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client

### Products

- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Quotations

- `GET /api/v1/quotations` - Get all quotations
- `GET /api/v1/quotations/:id` - Get quotation by ID
- `POST /api/v1/quotations` - Create new quotation
- `PUT /api/v1/quotations/:id` - Update quotation
- `DELETE /api/v1/quotations/:id` - Delete quotation
- `POST /api/v1/quotations/:id/duplicate` - Duplicate quotation

### Templates

- `GET /api/v1/templates` - Get all templates
- `GET /api/v1/templates/:id` - Get template by ID
- `POST /api/v1/templates` - Create new template
- `PUT /api/v1/templates/:id` - Update template
- `DELETE /api/v1/templates/:id` - Delete template

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api/v1
```

### Backend (server/.env)

```env
# Database Configuration
DATABASE_PROVIDER="sqlite"  # or "postgresql"
DATABASE_URL="file:./dev.db"  # or PostgreSQL connection string

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:5173"

# API Configuration
API_PREFIX="/api/v1"
```

## Database Schema

The application uses the following main entities:

- **Clients** - Customer information and contact details
- **Products** - Products, services, and subscriptions
- **Quotations** - Main quotation records with client relationships
- **QuotationItems** - Individual line items within quotations
- **Templates** - Quotation templates for reuse

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the API documentation at `/health` when the server is running
