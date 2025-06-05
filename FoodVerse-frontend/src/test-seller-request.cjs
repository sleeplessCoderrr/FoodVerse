const axios = require('axios');

const API_BASE_URL = 'http://localhost:7000/api/v1';

async function testSellerRequestFlow() {
    try {
        console.log('=== Testing Seller Request Flow ===');
        
        // Step 1: Register a new user
        console.log('\n1. Registering a new user...');
        const registerResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Test Seller',
            email: `testseller${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'consumer',
            phone: '+1234567890',
            address: '123 Test Street'
        });
        
        console.log('Registration successful:', {
            user: registerResponse.data.user,
            token: registerResponse.data.token.substring(0, 20) + '...'
        });
        
        const token = registerResponse.data.token;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        // Step 2: Create a seller request
        console.log('\n2. Creating seller request...');
        try {
            const sellerRequestResponse = await axios.post(`${API_BASE_URL}/seller-requests`, {
                id_number: 'ID123456789',
                reason: 'I want to sell my homemade food to help reduce food waste',
                location: 'Jakarta, Indonesia',
                face_image_url: 'https://example.com/face-image.jpg'
            }, { headers });
            
            console.log('Seller request created successfully:', sellerRequestResponse.data);
            return sellerRequestResponse.data;
            
        } catch (error) {
            console.error('Error creating seller request:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            
            // Check if it's a database error
            if (error.response?.data?.error?.includes('seller_requests')) {
                console.log('\n❌ Database table issue detected - seller_requests table not found');
                return null;
            }
            throw error;
        }
        
    } catch (error) {
        console.error('Test failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return null;
    }
}

// Run the test
testSellerRequestFlow()
    .then(result => {
        if (result) {
            console.log('\n✅ Seller request flow test completed successfully!');
        } else {
            console.log('\n❌ Seller request flow test failed!');
        }
    })
    .catch(error => {
        console.error('\n❌ Test failed with error:', error.message);
    });
