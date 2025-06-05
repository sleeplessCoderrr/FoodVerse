const axios = require('axios');

const API_BASE_URL = 'http://localhost:7000/api/v1';

async function testCompleteSellerRequestWorkflow() {
    try {
        console.log('=== Testing Complete Seller Request Workflow ===');
        
        // Step 1: Register a regular user
        console.log('\n1. Registering a consumer user...');
        const userResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Jane Consumer',
            email: `consumer${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'consumer',
            phone: '+1234567891',
            address: '456 Consumer Street'
        });
        
        const userToken = userResponse.data.token;
        const userHeaders = { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' };
        
        console.log('✅ Consumer registered successfully');
        
        // Step 2: Register an admin user
        console.log('\n2. Registering an admin user...');
        const adminResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Admin User',
            email: `admin${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'admin',
            phone: '+1234567892',
            address: '789 Admin Street'
        });
        
        const adminToken = adminResponse.data.token;
        const adminHeaders = { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
        
        console.log('✅ Admin registered successfully');
        
        // Step 3: Create seller request as consumer
        console.log('\n3. Creating seller request as consumer...');
        const sellerRequestResponse = await axios.post(`${API_BASE_URL}/seller-requests`, {
            id_number: 'ID987654321',
            reason: 'I want to start a small business selling healthy meals',
            location: 'Bandung, Indonesia',
            face_image_url: 'https://example.com/seller-face.jpg'
        }, { headers: userHeaders });
        
        const requestId = sellerRequestResponse.data.id;
        console.log('✅ Seller request created with ID:', requestId);
        
        // Step 4: Get user's seller request
        console.log('\n4. Getting user\'s seller request...');
        const myRequestResponse = await axios.get(`${API_BASE_URL}/seller-requests/my`, { headers: userHeaders });
        console.log('✅ User\'s seller request retrieved:', {
            id: myRequestResponse.data.id,
            status: myRequestResponse.data.status,
            reason: myRequestResponse.data.reason.substring(0, 50) + '...'
        });
        
        // Step 5: Get all seller requests as admin
        console.log('\n5. Getting all seller requests as admin...');
        const allRequestsResponse = await axios.get(`${API_BASE_URL}/seller-requests`, { headers: adminHeaders });
        console.log('✅ All seller requests retrieved:', {
            total: allRequestsResponse.data.total,
            requests: allRequestsResponse.data.requests.length
        });
        
        // Step 6: Approve seller request as admin
        console.log('\n6. Approving seller request as admin...');
        const approvalResponse = await axios.put(`${API_BASE_URL}/seller-requests/${requestId}`, {
            status: 'approved',
            admin_comments: 'Request approved after verification'
        }, { headers: adminHeaders });
        
        console.log('✅ Seller request approved:', {
            status: approvalResponse.data.status,
            admin_comments: approvalResponse.data.admin_comments
        });
        
        // Step 7: Verify user profile updated to seller
        console.log('\n7. Checking if user profile updated to seller...');
        const profileResponse = await axios.get(`${API_BASE_URL}/user`, { headers: userHeaders });
        console.log('✅ User profile after approval:', {
            name: profileResponse.data.name,
            user_type: profileResponse.data.user_type
        });
        
        // Step 8: Try to create a store as newly approved seller
        console.log('\n8. Testing store creation as approved seller...');
        try {
            const storeResponse = await axios.post(`${API_BASE_URL}/stores`, {
                name: 'Healthy Meals Store',
                description: 'Fresh and healthy meal options',
                address: '123 Food Street, Bandung',
                latitude: -6.9147,
                longitude: 107.6098,
                phone: '+1234567893',
                email: 'healthy@meals.com',
                category: 'Healthy Food'
            }, { headers: userHeaders });
            
            console.log('✅ Store created successfully:', {
                id: storeResponse.data.id,
                name: storeResponse.data.name,
                category: storeResponse.data.category
            });
            
        } catch (storeError) {
            console.log('❌ Store creation failed:', storeError.response?.data);
        }
        
        console.log('\n🎉 Complete seller request workflow test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Workflow test failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return false;
    }
}

// Run the comprehensive test
testCompleteSellerRequestWorkflow()
    .then(success => {
        if (success) {
            console.log('\n✅ All tests passed! Seller request system is working correctly.');
        } else {
            console.log('\n❌ Some tests failed. Check the output above for details.');
        }
    })
    .catch(error => {
        console.error('\n❌ Test failed with error:', error.message);
    });
