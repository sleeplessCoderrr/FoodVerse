// Setup script to create test users and sample data
// Run this with: node setup-test-data.js

const API_BASE = 'http://localhost:7000/api/v1';

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    
    const config = {
        method,
        headers,
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
      try {
        console.log(`Making ${method} request to ${API_BASE}${endpoint}`);
        if (token) {
            console.log(`With Authorization: Bearer ${token.substring(0, 20)}...`);
        }
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(result)}`);
        }
        
        return result;
    } catch (error) {
        console.error(`Error making request to ${endpoint}:`, error.message);
        throw error;
    }
}

// Sample users
const sampleUsers = [
    {
        name: "John Consumer",
        email: "consumer@test.com",
        password: "password123",
        user_type: "consumer",
        address: "Consumer Street, Jakarta"
    },
    {
        name: "Business Owner",
        email: "business@test.com", 
        password: "password123",
        user_type: "business",
        address: "Business Avenue, Jakarta"
    }
];

// Sample stores (to be created by business user)
const sampleStores = [
    {
        name: "Green Grocery Store",
        description: "Fresh organic produce and healthy food options",
        address: "123 Main Street, Jakarta",
        latitude: -6.2088,
        longitude: 106.8456,
        phone: "+62-21-1234567",
        email: "contact@greengrocery.com",
        category: "grocery",
        image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
    },
    {
        name: "Fresh Bakery",
        description: "Daily fresh bread and pastries",
        address: "456 Baker Street, Jakarta",
        latitude: -6.2100,
        longitude: 106.8470,
        phone: "+62-21-2345678",
        email: "info@freshbakery.com",
        category: "bakery",
        image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
    },
    {
        name: "Healthy Cafe",
        description: "Organic coffee and healthy meals",
        address: "789 Cafe Street, Jakarta",
        latitude: -6.2070,
        longitude: 106.8440,
        phone: "+62-21-3456789",
        email: "hello@healthycafe.com",
        category: "cafe",
        image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500"
    }
];

// Sample food bags
const sampleFoodBags = [
    {
        title: "Mixed Vegetable Surprise Box",
        description: "Fresh seasonal vegetables nearing expiry date",
        original_price: 25.00,
        discounted_price: 12.50,
        quantity_total: 5,
        pickup_time_start: "2025-06-04T16:00:00Z",
        pickup_time_end: "2025-06-04T19:00:00Z",
        image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500",
        category: "grocery"
    },
    {
        title: "Artisan Bread Bundle",
        description: "Day-old artisan breads at discounted price",
        original_price: 15.00,
        discounted_price: 7.50,
        quantity_total: 3,
        pickup_time_start: "2025-06-04T17:00:00Z",
        pickup_time_end: "2025-06-04T20:00:00Z",
        image_url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500",
        category: "bakery"
    },
    {
        title: "Healthy Meal Box",
        description: "Nutritious meals and smoothies combo",
        original_price: 20.00,
        discounted_price: 10.00,
        quantity_total: 4,
        pickup_time_start: "2025-06-04T15:00:00Z",
        pickup_time_end: "2025-06-04T18:00:00Z",
        image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
        category: "cafe"
    }
];

async function setupTestData() {
    console.log('🚀 Setting up test data for FoodVerse...\n');
    
    try {
        // 1. Register users
        console.log('👥 Registering test users...');
        for (const user of sampleUsers) {
            try {
                const result = await apiRequest('/register', 'POST', user);
                console.log(`✅ Registered ${user.user_type}: ${user.email}`);
            } catch (error) {
                if (error.message.includes('already exists')) {
                    console.log(`ℹ️  User ${user.email} already exists`);
                } else {
                    throw error;
                }
            }
        }
          // 2. Login as business user
        console.log('\n🔐 Logging in as business user...');
        const loginResult = await apiRequest('/login', 'POST', {
            email: sampleUsers[1].email,
            password: sampleUsers[1].password
        });
        
        const businessToken = loginResult.token;
        console.log('✅ Business user logged in successfully');
        console.log('🔑 Token extracted:', businessToken ? 'Yes' : 'No');
          // 3. Create stores
        console.log('\n🏪 Creating sample stores...');
        console.log('🔑 Using token:', businessToken.substring(0, 20) + '...');
        const createdStores = [];
        for (const store of sampleStores) {
            try {
                console.log(`Creating store: ${store.name} with token: ${businessToken ? 'Present' : 'Missing'}`);
                const result = await apiRequest('/stores', 'POST', store, businessToken);
                createdStores.push(result);
                console.log(`✅ Created store: ${store.name}`);
            } catch (error) {
                console.log(`⚠️  Error creating store ${store.name}:`, error.message);
            }
        }
          // 4. Create food bags
        console.log('\n🥘 Creating sample food bags...');
        console.log(`📊 Created stores count: ${createdStores.length}`);
          for (let i = 0; i < Math.min(createdStores.length, sampleFoodBags.length); i++) {
            const store = createdStores[i];
            console.log(`🏪 Store ${i}: ID=${store.id || store.ID}, Name=${store.name}`);
            console.log(`📋 Full store object:`, JSON.stringify(store, null, 2));
            
            const storeId = store.id || store.ID;
            const foodBag = {
                ...sampleFoodBags[i],
                store_id: storeId
            };
            
            console.log(`📦 Creating food bag with store_id: ${foodBag.store_id}`);
            
            try {
                const result = await apiRequest('/food-bags', 'POST', foodBag, businessToken);
                console.log(`✅ Created food bag: ${foodBag.title} for ${store.name}`);
            } catch (error) {
                console.log(`⚠️  Error creating food bag ${foodBag.title}:`, error.message);
                console.log(`📝 Food bag data:`, JSON.stringify(foodBag, null, 2));
            }
        }
        
        // 5. Test search functionality
        console.log('\n🔍 Testing search functionality...');
        
        const storeSearchParams = {
            latitude: -6.2088,
            longitude: 106.8456,
            radius: 10
        };
        
        const storesResult = await apiRequest('/stores/search', 'POST', storeSearchParams);
        console.log(`✅ Found ${storesResult.length || 0} stores`);
        
        const foodBagsResult = await apiRequest('/food-bags/search', 'POST', storeSearchParams);
        console.log(`✅ Found ${foodBagsResult.length || 0} food bags`);
        
        console.log('\n🎉 Test data setup completed successfully!');
        console.log('\n📋 Test Accounts Created:');
        console.log('Consumer: consumer@test.com / password123');
        console.log('Business: business@test.com / password123');
        console.log('\n🌐 You can now test the application at: http://localhost:5175');
        
    } catch (error) {
        console.error('❌ Error setting up test data:', error.message);
        process.exit(1);
    }
}

// Run the setup
setupTestData();
