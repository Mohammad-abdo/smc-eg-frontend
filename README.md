# SMC Digital Suite - Sinai Manganese Company Website

Modern, professional website for Sinai Manganese Company with full admin dashboard.

## Features

- 🌐 **Bilingual Support**: Full English and Arabic (RTL) support
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- 📱 **Responsive**: Fully responsive design for all devices
- 🔐 **Admin Dashboard**: Complete content management system
- 📊 **Analytics**: Statistics and reporting
- 🖼️ **Media Library**: Image and file management
- 📝 **Content Management**: Edit products, news, banners, and more

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **Routing**: React Router
- **State Management**: React Query
- **Charts**: Recharts
- **Backend**: Express.js (optional)

## Getting Started

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Setup (Optional)

```bash
cd backend
npm install
npm start
```

The backend runs on `https://back.smc-eg.com/api` by default.

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://your-api-url.vercel.app/api
VITE_USE_MOCK_API=false
```

## Admin Access

- **URL**: `/login`
- **Email**: `admin@smc-eg.com`
- **Password**: `admin123`

## Dashboard Features

- **Products Management**: Add, edit, delete products
- **News Management**: Manage news articles
- **Users Management**: Manage users and permissions
- **Media Library**: Upload and manage images
- **Hero Banners**: Manage homepage banners
- **Page Content**: Edit page content
- **Settings**: Site settings and configuration
- **Statistics**: View analytics and reports
- **Contacts**: Manage contact messages
- **Complaints**: Handle customer complaints

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Backend (Vercel/Railway/Render)

1. Deploy backend to your preferred platform
2. Update `VITE_API_URL` in frontend `.env`
3. Redeploy frontend

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
│   └── dashboard/  # Dashboard pages
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── services/       # API services
└── assets/         # Static assets
```

## License

© 2024 Sinai Manganese Company
