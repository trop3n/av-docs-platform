# AV Documentation Platform

A full-stack web application for creating technical AV diagrams and managing documentation. Built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Multi-user support with role-based access control (Admin, Editor, Viewer)
- **Documentation Management**: Create, edit, and search technical documentation with Markdown support
- **Interactive Diagrams**: Design AV signal flow diagrams with drag-and-drop interface
- **Device Templates**: Pre-built diagram templates for common AV setups
- **Export Functionality**: Export diagrams to JSON format
- **Real-time Diagram Editor**: Powered by ReactFlow with visual node-based editing
- **Categorization & Tagging**: Organize documents and diagrams with categories and tags

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Vite
- React Router
- ReactFlow (diagram editor)
- Axios
- React Markdown
- Lucide React (icons)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

### 1. Clone or navigate to the project directory

```bash
cd av-docs-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Update MongoDB URI, JWT secret, etc.
```

Edit the `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/av-docs-platform
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
UPLOAD_DIR=./uploads
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Linux/Mac
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Seed the Database (Optional)

Load sample data including an admin user, sample documents, and diagram templates:

```bash
cd backend
npm run seed
```

This creates:
- Admin user (credentials from .env: default is `admin@example.com` / `DevOnly123!`)
- Sample technical documents
- Three diagram templates

**IMPORTANT**: The seed credentials are in your `.env` file and are for DEVELOPMENT ONLY. Never use these in production!

## Running the Application

### Development Mode

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### First Login

If you ran the seed script:
- Email: `admin@example.com` (or value from `.env`)
- Password: `DevOnly123!` (or value from `.env`)

Otherwise, register a new account at http://localhost:3000/register

**Security Note**: Change these credentials immediately if you plan to deploy this application!

### User Roles

- **Admin**: Full access to create, edit, and delete all content
- **Editor**: Can create, edit, and delete documents and diagrams
- **Viewer**: Can only view documents and diagrams

### Creating Documents

1. Navigate to Documents page
2. Click "New Document"
3. Enter title, content (Markdown supported), category, and tags
4. Click "Save Document"

### Creating Diagrams

1. Navigate to Diagrams page
2. Click "New Diagram"
3. Select device type from dropdown
4. Click "Add Device" to add devices to the canvas
5. Drag devices to position them
6. Click and drag between devices to create connections
7. Fill in title, description, category, and tags
8. Optionally mark as template
9. Click "Save Diagram"

### Using Templates

1. Navigate to Diagrams
2. Filter by templates
3. Click "Duplicate" on any template
4. Modify the duplicated diagram as needed

## Project Structure

```
av-docs-platform/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   ├── seed.js          # Database seeding
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts (Auth)
│   │   ├── styles/      # CSS files
│   │   └── App.jsx      # Main app component
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get single document
- `POST /api/documents` - Create document (Editor/Admin)
- `PUT /api/documents/:id` - Update document (Editor/Admin)
- `DELETE /api/documents/:id` - Delete document (Editor/Admin)

### Diagrams
- `GET /api/diagrams` - Get all diagrams
- `GET /api/diagrams/:id` - Get single diagram
- `POST /api/diagrams` - Create diagram (Editor/Admin)
- `PUT /api/diagrams/:id` - Update diagram (Editor/Admin)
- `DELETE /api/diagrams/:id` - Delete diagram (Editor/Admin)
- `POST /api/diagrams/:id/duplicate` - Duplicate diagram (Editor/Admin)

## Device Types

The diagram editor includes these pre-configured AV device types:

- **Audio Device** (Green) - Microphones, speakers, DSPs, amplifiers
- **Video Device** (Blue) - Cameras, video processors, switchers
- **Network Device** (Orange) - Switches, routers, network infrastructure
- **Control System** (Purple) - Control processors, touch panels
- **Display** (Red) - Monitors, projectors, video walls
- **Source** (Cyan) - Computers, media players, streaming devices

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check the MongoDB URI in `.env`
- Verify MongoDB is listening on the correct port (default: 27017)

### Port Conflicts
- Backend default: 5000 (change in `.env`)
- Frontend default: 3000 (change in `vite.config.js`)

### Module Not Found Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB with authentication
4. Use a process manager like PM2: `pm2 start server.js`

### Frontend
1. Build the production bundle: `npm run build`
2. Serve the `dist` folder with a web server (nginx, Apache, etc.)
3. Configure environment variables for API URL

## Future Enhancements

- Real-time collaboration on diagrams
- Version history for documents and diagrams
- PDF export for diagrams
- Image upload support
- Advanced search with filters
- Dark mode
- Mobile responsive design improvements

## License

ISC

## Support

For issues or questions, please create an issue in the project repository.
