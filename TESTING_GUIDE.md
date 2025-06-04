# FoodVerse Application - Status & Testing Guide

## 🎉 Application Status: FULLY FUNCTIONAL

### ✅ Completed Features

#### Backend API (Port 7000)
- **Authentication System**
  - User registration (consumer/business)
  - JWT-based login system
  - Protected endpoints with proper middleware
  - Profile management

- **Store Management**
  - Business users can create/update/delete stores
  - Store search by location and radius
  - Store categorization (grocery, bakery, restaurant, cafe)

- **Food Bag Management**
  - Business users can create food bags for their stores
  - Search food bags by location, price range, category
  - Quantity tracking and availability status

- **Order System**
  - Consumers can place orders for food bags
  - Order status tracking
  - Pickup code generation and verification
  - Order history for both consumers and businesses

#### Frontend Application (Port 5173)
- **Authentication UI**
  - Beautiful registration page with form validation
  - Login page with proper error handling
  - Role-based dashboard routing

- **Consumer Features**
  - Search and browse food bags
  - View store details
  - Place orders with quantity selection
  - Order dialog with notes and total calculation

- **Business Features**
  - Store management dashboard
  - Food bag creation and management
  - Order management for business

### 🛠 Recent Fixes Applied
1. **JWT Authentication Issue**: Fixed middleware context key inconsistency (`userId` vs `user_id`)
2. **API Response Format**: Updated frontend to match backend response structure
3. **Registration Flow**: Enhanced error handling and user feedback
4. **Database Setup**: Successfully configured PostgreSQL with test data

## 🧪 Testing Instructions

### Quick Test Accounts
```
Consumer Account:
- Email: consumer@test.com
- Password: password123

Business Account:
- Email: business@test.com
- Password: password123
```

### Frontend Testing (http://localhost:5173)

#### 1. Registration Testing
- Navigate to `/register`
- Test with various account types (consumer/business)
- Verify form validation (email format, password length, etc.)
- Test duplicate email handling

#### 2. Login Testing
- Navigate to `/login`
- Use test accounts above
- Verify proper dashboard routing based on user type

#### 3. Consumer Dashboard Testing
- Login as consumer
- Search for food bags by location
- Click on food bags to view details
- Test order placement dialog
- Verify quantity selection and total calculation

#### 4. Business Dashboard Testing
- Login as business user
- Create new stores
- Add food bags to stores
- Manage existing inventory

### Backend API Testing (http://localhost:7000)

#### Test Endpoints
```bash
# Health Check
curl http://localhost:7000/swagger

# Register New User
curl -X POST http://localhost:7000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","user_type":"consumer"}'

# Login
curl -X POST http://localhost:7000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"consumer@test.com","password":"password123"}'

# Search Stores (no auth required)
curl -X POST http://localhost:7000/api/v1/stores/search \
  -H "Content-Type: application/json" \
  -d '{"latitude":-6.2088,"longitude":106.8456,"radius":10}'

# Search Food Bags (no auth required)
curl -X POST http://localhost:7000/api/v1/food-bags/search \
  -H "Content-Type: application/json" \
  -d '{"latitude":-6.2088,"longitude":106.8456,"radius":10}'
```

### Automated Testing Scripts
Run these from the frontend directory:

```bash
# Test registration functionality
node src/test-registration.js

# Test complete application flow
node src/test-complete-flow.js

# Setup additional test data
node src/setup-test-data.js
```

## 📊 Current Database State
- **Users**: ~10 test users (consumers and businesses)
- **Stores**: ~10 test stores across Jakarta
- **Food Bags**: ~4+ food bags with realistic data
- **Orders**: Ready for order placement testing

## 🚀 How to Start the Application

### Prerequisites
- Docker (for PostgreSQL)
- Node.js (for frontend)
- Go 1.19+ (for backend)

### Startup Commands
```bash
# 1. Start Database
cd c:/Coding/BINUS/React/FoodVerse
docker-compose up -d

# 2. Start Backend (Terminal 1)
cd c:/Coding/BINUS/React/FoodVerse/FoodVerse-backend
go run cmd/api/main.go

# 3. Start Frontend (Terminal 2)  
cd c:/Coding/BINUS/React/FoodVerse/FoodVerse-frontend
npm run dev
```

### Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:7000
- **API Documentation**: http://localhost:7000/swagger
- **Database**: localhost:5432 (postgres/postgres)

## 🎯 Ready for Testing

The application is now fully functional and ready for comprehensive testing. All major features are implemented:

- ✅ User authentication and authorization
- ✅ Store and food bag management
- ✅ Search functionality
- ✅ Order placement system
- ✅ Responsive UI with proper error handling
- ✅ Role-based access control

You can now test the complete "Too Good To Go" style application workflow from registration to order placement!
