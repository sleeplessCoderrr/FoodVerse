// End-to-End Testing Script for FoodVerse MVP
// Tests the complete user workflow from registration to store creation

const API_BASE = 'http://localhost:7000/api/v1';

// Test data
const testUsers = {
  consumer: {
    name: 'Test Consumer',
    email: 'consumer@test.com',
    password: 'password123',
    user_type: 'consumer'
  },
  seller: {
    name: 'Test Seller',
    email: 'seller@test.com',
    password: 'password123',
    user_type: 'seller'
  },
  admin: {
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    user_type: 'admin'
  }
};

const testSellerRequest = {
  id_number: 'ID123456789',
  reason: 'I want to join FoodVerse to help reduce food waste by selling surplus food from my restaurant. I have been running a small restaurant for 2 years and often have leftover food that could be sold at a discount instead of being thrown away.',
  location: '456 Restaurant Street, Jakarta, Indonesia',
  face_image_url: 'https://example.com/face-image.jpg'
};

const testStore = {
  name: 'Test Eco Restaurant',
  description: 'Sustainable restaurant offering surplus meals at great prices',
  address: '456 Restaurant Street, Jakarta, Indonesia',
  latitude: -6.2088,
  longitude: 106.8456,
  phone: '+62-21-987654',
  category: 'restaurant',
  opening_hours: '09:00-22:00'
};

const testFoodBag = {
  title: 'Mixed Meal Surprise',
  description: 'A variety of our delicious dishes from today\'s menu',
  original_price: 25.00,
  discounted_price: 12.50,
  quantity_available: 5,
  pickup_time_start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  pickup_time_end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
  category: 'restaurant'
};

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : null
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error: ${result.error || result.message || response.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ API Request failed: ${method} ${endpoint}`, error.message);
    throw error;
  }
}

// Test functions
async function testUserRegistration() {
  console.log('\n🧪 Testing User Registration...');
  
  for (const [userType, userData] of Object.entries(testUsers)) {
    try {
      console.log(`  📝 Registering ${userType}...`);
      const result = await apiRequest('/register', 'POST', userData);
      
      testUsers[userType].id = result.user.id;
      testUsers[userType].token = result.token;
      
      console.log(`  ✅ ${userType} registered successfully (ID: ${result.user.id})`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`  ⚠️  ${userType} already exists, trying to login...`);
        try {
          const loginResult = await apiRequest('/login', 'POST', {
            email: userData.email,
            password: userData.password
          });
          testUsers[userType].id = loginResult.user.id;
          testUsers[userType].token = loginResult.token;
          console.log(`  ✅ ${userType} login successful`);
        } catch (loginError) {
          console.log(`  ❌ ${userType} login failed:`, loginError.message);
        }
      } else {
        console.log(`  ❌ ${userType} registration failed:`, error.message);
      }
    }
  }
}

async function testSellerRequestFlow() {
  console.log('\n🧪 Testing Seller Request Flow...');
  
  if (!testUsers.seller.token) {
    console.log('  ❌ Seller not authenticated, skipping...');
    return;
  }

  try {
    // Create seller request
    console.log('  📝 Creating seller request...');
    const request = await apiRequest('/seller-requests', 'POST', testSellerRequest, testUsers.seller.token);
    console.log(`  ✅ Seller request created (ID: ${request.id})`);

    // Get seller request
    console.log('  📋 Retrieving seller request...');
    const myRequest = await apiRequest('/seller-requests/my', 'GET', null, testUsers.seller.token);
    console.log(`  ✅ Seller request retrieved (Status: ${myRequest.status})`);

    // Admin approves request (if admin is available)
    if (testUsers.admin.token) {
      console.log('  ⚡ Admin approving seller request...');
      const approvalData = {
        status: 'approved',
        admin_comments: 'Application looks good. Welcome to FoodVerse!'
      };
      await apiRequest(`/seller-requests/${request.id}`, 'PUT', approvalData, testUsers.admin.token);
      console.log('  ✅ Seller request approved by admin');
    }

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('  ⚠️  Seller request already exists');
    } else {
      console.log('  ❌ Seller request flow failed:', error.message);
    }
  }
}

async function testStoreCreation() {
  console.log('\n🧪 Testing Store Creation...');
  
  if (!testUsers.seller.token) {
    console.log('  ❌ Seller not authenticated, skipping...');
    return;
  }

  try {
    console.log('  🏪 Creating store...');
    const store = await apiRequest('/stores', 'POST', testStore, testUsers.seller.token);
    testStore.id = store.id;
    console.log(`  ✅ Store created successfully (ID: ${store.id})`);

    // Get my stores
    console.log('  📋 Retrieving seller stores...');
    const myStores = await apiRequest('/stores/my', 'GET', null, testUsers.seller.token);
    console.log(`  ✅ Retrieved ${myStores.length} stores`);

  } catch (error) {
    console.log('  ❌ Store creation failed:', error.message);
  }
}

async function testFoodBagCreation() {
  console.log('\n🧪 Testing Food Bag Creation...');
  
  if (!testUsers.seller.token || !testStore.id) {
    console.log('  ❌ Store not created, skipping...');
    return;
  }

  try {
    console.log('  🥖 Creating food bag...');
    const foodBagData = { ...testFoodBag, store_id: testStore.id };
    const foodBag = await apiRequest('/food-bags', 'POST', foodBagData, testUsers.seller.token);
    testFoodBag.id = foodBag.id;
    console.log(`  ✅ Food bag created successfully (ID: ${foodBag.id})`);

    // Get food bags for store
    console.log('  📋 Retrieving store food bags...');
    const storeFoodBags = await apiRequest(`/store-food-bags/${testStore.id}`, 'GET', null, testUsers.seller.token);
    console.log(`  ✅ Retrieved ${storeFoodBags.length} food bags for store`);

  } catch (error) {
    console.log('  ❌ Food bag creation failed:', error.message);
  }
}

async function testStoreDiscovery() {
  console.log('\n🧪 Testing Store Discovery...');
  
  try {
    console.log('  🔍 Searching for stores...');
    const searchData = {
      latitude: -6.2088,
      longitude: 106.8456,
      radius: 10
    };
    const stores = await apiRequest('/stores/search', 'POST', searchData);
    console.log(`  ✅ Found ${stores.length} stores`);

    if (stores.length > 0) {
      const store = stores[0];
      console.log(`  📋 Getting details for store: ${store.name}`);
      const storeDetails = await apiRequest(`/stores/${store.id}`, 'GET');
      console.log(`  ✅ Store details retrieved: ${storeDetails.name}`);
    }

  } catch (error) {
    console.log('  ❌ Store discovery failed:', error.message);
  }
}

async function testOrderCreation() {
  console.log('\n🧪 Testing Order Creation...');
  
  if (!testUsers.consumer.token || !testFoodBag.id) {
    console.log('  ❌ Consumer not authenticated or food bag not available, skipping...');
    return;
  }

  try {
    console.log('  🛒 Creating order...');
    const orderData = {
      food_bag_id: testFoodBag.id,
      quantity: 1
    };
    const order = await apiRequest('/orders', 'POST', orderData, testUsers.consumer.token);
    console.log(`  ✅ Order created successfully (ID: ${order.id})`);

    // Get my orders
    console.log('  📋 Retrieving consumer orders...');
    const myOrders = await apiRequest('/orders/my', 'GET', null, testUsers.consumer.token);
    console.log(`  ✅ Retrieved ${myOrders.length} orders`);

  } catch (error) {
    console.log('  ❌ Order creation failed:', error.message);
  }
}

// Main test execution
async function runEndToEndTests() {
  console.log('🚀 Starting FoodVerse End-to-End Tests...\n');
  console.log('📋 Test Plan:');
  console.log('  1. User Registration (Consumer, Seller, Admin)');
  console.log('  2. Seller Request Flow');
  console.log('  3. Store Creation');
  console.log('  4. Food Bag Creation');
  console.log('  5. Store Discovery');
  console.log('  6. Order Creation');
  console.log('=====================================');

  try {
    await testUserRegistration();
    await testSellerRequestFlow();
    await testStoreCreation();
    await testFoodBagCreation();
    await testStoreDiscovery();
    await testOrderCreation();

    console.log('\n🎉 End-to-End Tests Completed!');
    console.log('=====================================');
    console.log('📊 Test Summary:');
    console.log(`  • Users: ${Object.keys(testUsers).length} registered`);
    console.log(`  • Store: ${testStore.id ? 'Created' : 'Failed'}`);
    console.log(`  • Food Bag: ${testFoodBag.id ? 'Created' : 'Failed'}`);
    console.log('=====================================');

  } catch (error) {
    console.log('\n❌ End-to-End Tests Failed:', error.message);
  }
}

// Export for module use or run directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runEndToEndTests };
} else {
  runEndToEndTests();
}
