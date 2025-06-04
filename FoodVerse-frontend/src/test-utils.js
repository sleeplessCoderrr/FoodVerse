// Test script to create sample data for FoodVerse application
// Run this in the browser console after registering a business user

const API_BASE = 'http://localhost:7000/api/v1';

// Helper function to get auth token from localStorage
function getAuthToken() {
    const authData = localStorage.getItem('foodverse_auth');
    if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.token;
    }
    return null;
}

// Helper function to make authenticated requests
async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = getAuthToken();
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
    
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    return await response.json();
}

// Sample store data
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
        name: "Sunrise Bakery",
        description: "Fresh bread, pastries, and baked goods daily",
        address: "456 Baker Street, Jakarta",
        latitude: -6.2100,
        longitude: 106.8470,
        phone: "+62-21-2345678",
        email: "hello@sunrisebakery.com",
        category: "bakery",
        image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
    }
];

// Sample food bag data (will be created after stores)
const sampleFoodBags = [
    {
        title: "Mixed Vegetable Bag",
        description: "Assorted fresh vegetables nearing expiry date",
        original_price: 25.00,
        discounted_price: 10.00,
        quantity_total: 5,
        pickup_time_start: "2025-06-04T18:00:00Z",
        pickup_time_end: "2025-06-04T21:00:00Z",
        image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500",
        category: "vegetables"
    },
    {
        title: "Fresh Bread Bundle",
        description: "Day-old artisan breads at discounted price",
        original_price: 15.00,
        discounted_price: 7.50,
        quantity_total: 3,
        pickup_time_start: "2025-06-04T17:00:00Z",
        pickup_time_end: "2025-06-04T20:00:00Z",
        image_url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500",
        category: "bakery"
    }
];

// Function to create sample data
async function createSampleData() {
    console.log('Creating sample stores and food bags...');
    
    try {
        // Create stores
        const createdStores = [];
        for (const store of sampleStores) {
            console.log(`Creating store: ${store.name}`);
            const result = await apiRequest('/stores', 'POST', store);
            console.log('Store created:', result);
            createdStores.push(result);
        }
        
        // Create food bags for each store
        for (let i = 0; i < createdStores.length; i++) {
            const store = createdStores[i];
            const foodBag = {
                ...sampleFoodBags[i],
                store_id: store.id
            };
            
            console.log(`Creating food bag: ${foodBag.title} for store: ${store.name}`);
            const result = await apiRequest('/food-bags', 'POST', foodBag);
            console.log('Food bag created:', result);
        }
        
        console.log('Sample data creation completed!');
        
    } catch (error) {
        console.error('Error creating sample data:', error);
    }
}

// Function to test search functionality
async function testSearchFunctionality() {
    console.log('Testing search functionality...');
    
    try {
        // Test store search
        const storeSearchParams = {
            latitude: -6.2088,
            longitude: 106.8456,
            radius: 10
        };
        
        console.log('Searching stores...');
        const stores = await apiRequest('/stores/search', 'POST', storeSearchParams);
        console.log('Found stores:', stores);
        
        // Test food bag search
        const foodBagSearchParams = {
            latitude: -6.2088,
            longitude: 106.8456,
            radius: 10
        };
        
        console.log('Searching food bags...');
        const foodBags = await apiRequest('/food-bags/search', 'POST', foodBagSearchParams);
        console.log('Found food bags:', foodBags);
        
    } catch (error) {
        console.error('Error testing search:', error);
    }
}

console.log('FoodVerse Test Utils Loaded!');
console.log('Available functions:');
console.log('- createSampleData(): Create sample stores and food bags (requires business user login)');
console.log('- testSearchFunctionality(): Test search endpoints');
console.log('- apiRequest(endpoint, method, data): Make authenticated API requests');
console.log('');
console.log('To create sample data:');
console.log('1. Register as a business user');
console.log('2. Login');
console.log('3. Run: createSampleData()');
