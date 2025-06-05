const axios = require('axios');

const API_BASE_URL = 'http://localhost:7000/api/v1';

async function testFoodBagManagement() {
    try {
        console.log('=== Testing Food Bag Management for Sellers ===');
        
        // Step 1: Create a seller with store
        console.log('\n1. Setting up seller with store...');
        
        // Register consumer first
        const userResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Food Bag Seller',
            email: `foodseller${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'consumer',
            phone: '+1234567890',
            address: '123 Food Street'
        });
        
        const userToken = userResponse.data.token;
        const userHeaders = { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' };
        
        // Create admin to approve seller request
        const adminResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Admin Approver',
            email: `admin_approver_${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'admin',
            phone: '+1234567891',
            address: '789 Admin Street'
        });
        
        const adminToken = adminResponse.data.token;
        const adminHeaders = { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
        
        // Create seller request
        const sellerRequestResponse = await axios.post(`${API_BASE_URL}/seller-requests`, {
            id_number: 'FOOD123456',
            reason: 'I want to sell fresh food bags to reduce waste',
            location: 'Jakarta Food District',
            face_image_url: 'https://example.com/food-seller.jpg'
        }, { headers: userHeaders });        // Approve seller request
        await axios.put(`${API_BASE_URL}/seller-requests/${sellerRequestResponse.data.id}`, {
            status: 'approved',
            admin_comments: 'Approved for food bag testing'
        }, { headers: adminHeaders });
        
        console.log('✅ Seller approved');
        
        // Create store
        const storeResponse = await axios.post(`${API_BASE_URL}/stores`, {
            name: 'Fresh Food Market',
            description: 'Quality fresh food and surprise bags',
            address: '456 Market Street, Jakarta',
            latitude: -6.2088,
            longitude: 106.8456,
            phone: '+6212345678',
            email: 'fresh@foodmarket.com',
            category: 'Grocery'
        }, { headers: userHeaders });        const storeId = storeResponse.data.id;
        console.log('✅ Store created:', storeId);
        
        // Step 2: Create food bags
        console.log('\n2. Creating food bags...');
        
        const foodBag1Response = await axios.post(`${API_BASE_URL}/food-bags`, {
            store_id: storeId,
            title: 'Mixed Vegetable Bag',
            description: 'Fresh seasonal vegetables - perfect for families',
            original_price: 25.00,
            discounted_price: 10.00,
            quantity_total: 10,
            pickup_time_start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            pickup_time_end: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
            category: 'Vegetables',
            image_url: 'https://example.com/vegetables.jpg'
        }, { headers: userHeaders });
        
        const foodBag2Response = await axios.post(`${API_BASE_URL}/food-bags`, {
            store_id: storeId,
            title: 'Bakery Surprise Box',
            description: 'Assorted breads and pastries from today',
            original_price: 15.00,
            discounted_price: 6.00,
            quantity_total: 5,
            pickup_time_start: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
            pickup_time_end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
            category: 'Bakery',
            image_url: 'https://example.com/bakery.jpg'
        }, { headers: userHeaders });        console.log('✅ Food bags created:', {
            vegetable_bag: foodBag1Response.data.ID,
            bakery_bag: foodBag2Response.data.ID
        });
        
        // Step 3: Test food bag retrieval
        console.log('\n3. Testing food bag retrieval...');        // Get food bag by ID
        const foodBag1Details = await axios.get(`${API_BASE_URL}/food-bags/${foodBag1Response.data.ID}`);
        console.log('✅ Food bag details retrieved:', {
            title: foodBag1Details.data.title,
            discount_percent: foodBag1Details.data.discount_percent,
            quantity_left: foodBag1Details.data.quantity_left
        });
        
        // Get food bags by store
        const storeFoodBags = await axios.get(`${API_BASE_URL}/store-food-bags/${storeId}`);
        console.log('✅ Store food bags retrieved:', storeFoodBags.data.length);
        
        // Step 4: Test food bag search
        console.log('\n4. Testing food bag search...');
        
        const searchResponse = await axios.post(`${API_BASE_URL}/food-bags/search`, {
            latitude: -6.2088,
            longitude: 106.8456,
            radius: 10.0,
            category: 'Vegetables',
            max_price: 15.00
        });
        
        console.log('✅ Food bag search results:', searchResponse.data.length);
        
        // Step 5: Test food bag updates
        console.log('\n5. Testing food bag updates...');
          const updateResponse = await axios.put(`${API_BASE_URL}/food-bags/${foodBag1Response.data.ID}`, {
            store_id: storeId,
            title: 'Premium Mixed Vegetable Bag',
            description: 'Fresh seasonal vegetables - perfect for families (Updated)',
            original_price: 25.00,
            discounted_price: 8.00, // Changed price
            quantity_total: 12, // Increased quantity
            pickup_time_start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            pickup_time_end: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            category: 'Vegetables',
            image_url: 'https://example.com/premium-vegetables.jpg'
        }, { headers: userHeaders });
        
        console.log('✅ Food bag updated:', {
            new_title: updateResponse.data.title,
            new_price: updateResponse.data.discounted_price,
            new_quantity: updateResponse.data.quantity_total
        });
        
        // Step 6: Test order creation
        console.log('\n6. Testing order creation...');
        
        // Create a consumer to place orders
        const consumerResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Food Buyer',
            email: `buyer${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'consumer',
            phone: '+1234567892',
            address: '789 Buyer Street'
        });
        
        const consumerToken = consumerResponse.data.token;
        const consumerHeaders = { 'Authorization': `Bearer ${consumerToken}`, 'Content-Type': 'application/json' };        // Place an order
        const orderResponse = await axios.post(`${API_BASE_URL}/orders`, {
            food_bag_id: foodBag1Response.data.ID,
            quantity: 2,
            notes: 'Please include extra vegetables if possible'
        }, { headers: consumerHeaders });        console.log('✅ Order created:', {
            order_id: orderResponse.data.ID,
            total_price: orderResponse.data.total_price,
            pickup_code: orderResponse.data.pickup_code
        });
        
        // Step 7: Test order management by seller
        console.log('\n7. Testing order management by seller...');
        
        // Get store orders as seller
        const storeOrders = await axios.get(`${API_BASE_URL}/store/${storeId}/orders`, { headers: userHeaders });
        console.log('✅ Store orders retrieved:', storeOrders.data.length);        // Update order status
        const statusUpdateResponse = await axios.put(`${API_BASE_URL}/orders/${orderResponse.data.ID}/status`, {
            status: 'preparing'
        }, { headers: userHeaders });
        
        console.log('✅ Order status updated:', statusUpdateResponse.data.status);
        
        // Step 8: Test pickup code verification
        console.log('\n8. Testing pickup verification...');        // Update order to ready
        await axios.put(`${API_BASE_URL}/orders/${orderResponse.data.ID}/status`, {
            status: 'ready'
        }, { headers: userHeaders });
          // Verify pickup code
        const pickupResponse = await axios.post(`${API_BASE_URL}/orders/verify-pickup`, {
            pickup_code: orderResponse.data.pickup_code
        }, { headers: userHeaders });
        
        console.log('✅ Pickup verified:', {
            status: pickupResponse.data.status,
            completed: pickupResponse.data.picked_up_at !== null
        });
        
        // Step 9: Test food bag deletion
        console.log('\n9. Testing food bag deletion...');
        
        await axios.delete(`${API_BASE_URL}/food-bags/${foodBag2Response.data.ID}`, { headers: userHeaders });
        console.log('✅ Food bag deleted successfully');        // Verify deletion
        try {
            await axios.get(`${API_BASE_URL}/food-bags/${foodBag2Response.data.ID}`);
            console.log('❌ Food bag should have been deleted');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Food bag deletion verified');
            }
        }
        
        console.log('\n🎉 Complete food bag management test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Food bag management test failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return false;
    }
}

// Run the comprehensive food bag test
testFoodBagManagement()
    .then(success => {
        if (success) {
            console.log('\n✅ All food bag management tests passed! System is working correctly.');
        } else {
            console.log('\n❌ Some food bag management tests failed.');
        }
    })
    .catch(error => {
        console.error('\n❌ Test failed with error:', error.message);
    });
