const axios = require('axios');

const API_BASE_URL = 'http://localhost:7000/api/v1';

async function debugFoodBagCreation() {
    try {
        console.log('=== Debugging Food Bag Creation Response ===');
        
        // Register consumer
        const userResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Debug User',
            email: `debug${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'consumer',
            phone: '+1234567890',
            address: '123 Debug Street'
        });
        
        const userToken = userResponse.data.token;
        const userHeaders = { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' };
        
        // Register admin
        const adminResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Debug Admin',
            email: `debugadmin${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'admin',
            phone: '+1234567891',
            address: '789 Admin Street'
        });
        
        const adminToken = adminResponse.data.token;
        const adminHeaders = { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
        
        // Create seller request
        const sellerRequestResponse = await axios.post(`${API_BASE_URL}/seller-requests`, {
            id_number: 'DEBUG123456',
            reason: 'Debug testing',
            location: 'Debug City',
            face_image_url: 'https://example.com/debug.jpg'
        }, { headers: userHeaders });
        
        console.log('Seller request response:', JSON.stringify(sellerRequestResponse.data, null, 2));
        
        // Approve seller request
        await axios.put(`${API_BASE_URL}/seller-requests/${sellerRequestResponse.data.id}`, {
            status: 'approved',
            admin_comments: 'Debug approval'
        }, { headers: adminHeaders });
        
        // Create store
        const storeResponse = await axios.post(`${API_BASE_URL}/stores`, {
            name: 'Debug Store',
            description: 'Store for debugging',
            address: '123 Debug Store Street',
            latitude: -6.2088,
            longitude: 106.8456,
            phone: '+6212345678',
            email: 'debug@store.com',
            category: 'Debug'
        }, { headers: userHeaders });
        
        console.log('Store response:', JSON.stringify(storeResponse.data, null, 2));
        
        // Create food bag
        const foodBagResponse = await axios.post(`${API_BASE_URL}/food-bags`, {
            store_id: storeResponse.data.id,
            title: 'Debug Food Bag',
            description: 'Food bag for debugging',
            original_price: 25.00,
            discounted_price: 10.00,
            quantity_total: 5,
            pickup_time_start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            pickup_time_end: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            category: 'Debug',
            image_url: 'https://example.com/debug-food.jpg'
        }, { headers: userHeaders });
        
        console.log('Food bag response:');
        console.log('Full response:', JSON.stringify(foodBagResponse.data, null, 2));
        console.log('Response keys:', Object.keys(foodBagResponse.data));
        console.log('ID field:', foodBagResponse.data.id);
        console.log('ID field (capital):', foodBagResponse.data.ID);
        
    } catch (error) {
        console.error('Debug failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
    }
}

debugFoodBagCreation();
