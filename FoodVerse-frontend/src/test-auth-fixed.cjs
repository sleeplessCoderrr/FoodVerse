const axios = require('axios');

const API_BASE = 'http://localhost:7000/api/v1';

async function testAuthenticationFlow() {
    console.log('🚀 Testing Authentication Flow After Fixes');
    console.log('==========================================\n');

    try {
        // Test 1: User Registration
        console.log('📝 Step 1: User Registration');        const registerData = {
            name: 'Test User',
            email: `testuser${Date.now()}@example.com`,
            password: 'testpassword123',
            user_type: 'consumer',
            phone: '+1234567890'
        };

        const registerResponse = await axios.post(`${API_BASE}/register`, registerData);
        console.log('✅ Registration successful:', registerResponse.data);
        
        // Test 2: User Login
        console.log('\n🔐 Step 2: User Login');
        const loginData = {
            email: registerData.email,
            password: registerData.password
        };

        const loginResponse = await axios.post(`${API_BASE}/login`, loginData);
        console.log('✅ Login successful:', loginResponse.data);
        
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // Test 3: Get User Profile  
        console.log('\n👤 Step 3: Get User Profile');
        const profileResponse = await axios.get(`${API_BASE}/user`, { headers });
        console.log('✅ Profile retrieved:', profileResponse.data);

        // Test 4: Create Seller Request (THIS WAS FAILING BEFORE)
        console.log('\n🏪 Step 4: Create Seller Request (Previously Failed)');        const sellerRequestData = {
            id_number: '1234567890123456',
            reason: 'I want to sell food on FoodVerse platform to reduce food waste',
            location: '123 Test Street, Test City, TC 12345',
            face_image_url: 'https://example.com/face-image.jpg'
        };

        const sellerRequestResponse = await axios.post(`${API_BASE}/seller-requests`, sellerRequestData, { headers });
        console.log('✅ Seller request created successfully:', sellerRequestResponse.data);

        // Test 5: Get My Seller Request (THIS WAS ALSO FAILING BEFORE)
        console.log('\n📋 Step 5: Get My Seller Request (Previously Failed)');
        const mySellerRequestResponse = await axios.get(`${API_BASE}/seller-requests/my`, { headers });
        console.log('✅ My seller request retrieved successfully:', mySellerRequestResponse.data);

        console.log('\n🎉 SUCCESS! All authentication issues have been fixed!');
        console.log('🔧 The context key fix from "userID" to "user_id" resolved the 401 errors.');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Run the test
testAuthenticationFlow();
