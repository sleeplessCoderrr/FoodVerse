# FoodVerse Frontend - Authentication System

A complete authentication system for the FoodVerse food waste reduction platform, built with React, TypeScript, shadcn/ui, and Tailwind CSS.

## 🚀 Features Implemented

### ✅ Authentication System
- **Login Page** - Email/password authentication with validation
- **Register Page** - User registration with form validation
- **Dashboard** - Protected dashboard page for authenticated users
- **Theme Support** - Light/dark/system theme toggle
- **Protected Routes** - Route guards for authenticated content
- **Token Management** - JWT token storage and refresh handling

### ✅ UI Components
- **Modern Design** - Built with shadcn/ui components
- **Responsive Layout** - Mobile-first responsive design
- **Form Validation** - Client-side validation using Zod schemas
- **Loading States** - Spinner indicators during API calls
- **Error Handling** - User-friendly error messages
- **Password Visibility** - Toggle password visibility in forms

### ✅ API Integration
- **Backend Connection** - Connected to Go backend API
- **Axios Configuration** - HTTP client with interceptors
- **Authentication Context** - React context for auth state management
- **Type Safety** - Full TypeScript support with proper types

## 🛠️ Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI component library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide Icons** - Beautiful icon library

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── LoginPage.tsx       # Login form component
│   ├── RegisterPage.tsx    # Registration form component
│   ├── Dashboard.tsx       # Protected dashboard
│   ├── ProtectedRoute.tsx  # Route guard component
│   ├── theme-provider.tsx  # Theme context provider
│   └── theme-toggle.tsx    # Theme switcher component
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── services/
│   ├── api.ts             # Axios configuration
│   └── authService.ts     # Authentication API calls
├── lib/
│   └── utils.ts           # Utility functions
└── styles/
    └── globals.css        # Global styles with CSS variables
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- Go 1.21+ (for backend)

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser at `http://localhost:5174`

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd ../FoodVerse-backend
   ```

2. Start the Go server:
   ```bash
   air
   ```

3. Backend runs at `http://localhost:7000`
4. Swagger docs available at `http://localhost:7000/swagger/index.html`

## 🔐 Authentication Flow

1. **Registration**:
   - User fills registration form
   - Client-side validation with Zod
   - API call to `/api/v1/register`
   - JWT token stored in localStorage
   - User redirected to dashboard

2. **Login**:
   - User enters email/password
   - API call to `/api/v1/login`
   - JWT token stored in localStorage
   - User redirected to dashboard

3. **Protected Routes**:
   - Routes check authentication status
   - Unauthorized users redirected to login
   - Token validated on each request

4. **Logout**:
   - Token removed from localStorage
   - User state cleared
   - Redirect to login page

## 🎨 Theme System

The app supports three theme modes:
- **Light** - Default light theme
- **Dark** - Dark theme for low-light usage
- **System** - Follows system preference

Theme preference is persisted in localStorage and applied via CSS custom properties.

## 📝 API Endpoints

### Authentication
- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login
- `GET /api/v1/user` - Get user profile (protected)

### Response Format
```json
{
  "message": "Success message",
  "data": {
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "role": "consumer"
    },
    "token": "jwt.token.here"
  }
}
```

## 🔧 Configuration

### Environment Variables
Create `.env.local` for custom configuration:
```env
VITE_API_BASE_URL=http://localhost:7000/api/v1
```

### Theme Customization
Modify theme colors in `src/index.css`:
```css
:root {
  --primary: /* your primary color */;
  --secondary: /* your secondary color */;
  /* ... */
}
```

## 🧪 Testing

### Manual Testing
1. Run the test script in browser console:
   ```javascript
   // Copy contents of src/test-auth.js and run in browser console
   ```

2. Test user flows:
   - Register new user
   - Login with existing user
   - Access protected dashboard
   - Toggle theme modes
   - Logout functionality

### Test Credentials
Use these for testing:
- **Email**: `test@foodverse.com`
- **Password**: `password123`

## 🚧 Next Steps

### Planned Features
- [ ] **Food Bag Listings** - Browse available food bags
- [ ] **Store Directory** - Find partner stores
- [ ] **Order Management** - Place and track orders
- [ ] **User Profile** - Edit profile information
- [ ] **Favorites** - Save favorite stores/items
- [ ] **Notifications** - Real-time updates
- [ ] **Maps Integration** - Location-based features

### Technical Improvements
- [ ] **Error Boundaries** - React error boundaries
- [ ] **Loading Skeletons** - Better loading states
- [ ] **Offline Support** - PWA capabilities
- [ ] **Push Notifications** - Browser notifications
- [ ] **Image Upload** - Profile and item images
- [ ] **Search & Filters** - Advanced filtering
- [ ] **Analytics** - User behavior tracking

## 📞 Support

For questions or issues:
1. Check the browser console for errors
2. Verify backend is running on port 7000
3. Ensure all dependencies are installed
4. Check network requests in browser DevTools

## 🏆 Success Metrics

✅ **Complete Authentication System** - Login, register, logout, protected routes
✅ **Modern UI/UX** - Professional design with dark/light themes  
✅ **Type Safety** - Full TypeScript implementation
✅ **Form Validation** - Client-side validation with error handling
✅ **API Integration** - Connected to Go backend with proper error handling
✅ **Responsive Design** - Works on mobile and desktop
✅ **Development Ready** - Hot reloading for both frontend and backend

The authentication system is now production-ready and can serve as the foundation for the complete FoodVerse application!
