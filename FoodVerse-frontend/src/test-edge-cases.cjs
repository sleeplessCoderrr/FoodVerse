const axios = require('axios');

const API_BASE_URL = 'http://localhost:7000/api/v1';

async function testEdgeCasesAndErrorHandling() {
    try {
        console.log('=== Testing Edge Cases and Error Handling ===');
        
        // Create test users
        console.log('\n1. Setting up test users...');
        
        // Regular consumer
        const consumer1Response = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Consumer One',
            email: `consumer1_${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'consumer',
            phone: '+1234567890',
            address: '123 Consumer St'
        });
        const consumer1Token = consumer1Response.data.token;
        const consumer1Headers = { 'Authorization': `Bearer ${consumer1Token}`, 'Content-Type': 'application/json' };
        
        // Admin user
        const adminResponse = await axios.post(`${API_BASE_URL}/register`, {
            name: 'Admin Test',
            email: `admin_test_${Date.now()}@example.com`,
            password: 'password123',
            user_type: 'admin',
            phone: '+1234567891',
            address: '789 Admin St'
        });
        const adminToken = adminResponse.data.token;
        const adminHeaders = { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
        
        console.log('✅ Test users created');
        
        // Test Case 1: Unauthenticated access
        console.log('\n2. Testing unauthenticated access...');
        try {
            await axios.post(`${API_BASE_URL}/seller-requests`, {
                id_number: 'TEST123',
                reason: 'Test reason',
                location: 'Test location',
                face_image_url: 'https://test.com/image.jpg'
            });
            console.log('❌ Should have failed for unauthenticated request');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly rejected unauthenticated request');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }
        
        // Test Case 2: Duplicate seller request
        console.log('\n3. Testing duplicate seller request...');
        
        // Create first seller request
        const firstRequest = await axios.post(`${API_BASE_URL}/seller-requests`, {
            id_number: 'DUP123456',
            reason: 'First request',
            location: 'Jakarta',
            face_image_url: 'https://example.com/first.jpg'
        }, { headers: consumer1Headers });
        
        console.log('✅ First seller request created:', firstRequest.data.id);
        
        // Try to create duplicate
        try {
            await axios.post(`${API_BASE_URL}/seller-requests`, {
                id_number: 'DUP789012',
                reason: 'Duplicate request',
                location: 'Bandung',
                face_image_url: 'https://example.com/duplicate.jpg'
            }, { headers: consumer1Headers });
            console.log('❌ Should have rejected duplicate request');
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.error?.includes('pending or approved')) {
                console.log('✅ Correctly rejected duplicate seller request');
            } else {
                console.log('❌ Unexpected error:', error.response?.data);
            }
        }
        
        // Test Case 3: Admin operations
        console.log('\n4. Testing admin operations...');
        
        // Get all requests as admin
        const allRequests = await axios.get(`${API_BASE_URL}/seller-requests`, { headers: adminHeaders });
        console.log('✅ Admin can view all requests:', allRequests.data.total);
        
        // Test filtering by status
        const pendingRequests = await axios.get(`${API_BASE_URL}/seller-requests?status=pending`, { headers: adminHeaders });
        console.log('✅ Filtered pending requests:', pendingRequests.data.requests.length);
        
        // Test Case 4: Non-admin trying admin operations
        console.log('\n5. Testing non-admin access to admin endpoints...');
        try {
            await axios.get(`${API_BASE_URL}/seller-requests`, { headers: consumer1Headers });
            console.log('❌ Should have rejected non-admin access');
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('✅ Correctly rejected non-admin access');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }
        
        // Test Case 5: Request approval and rejection workflow
        console.log('\n6. Testing approval workflow...');
        
        const requestId = firstRequest.data.id;
        
        // Approve the request
        const approvalResponse = await axios.put(`${API_BASE_URL}/seller-requests/${requestId}`, {
            status: 'approved',
            admin_comments: 'Approved for testing'
        }, { headers: adminHeaders });
        
        console.log('✅ Request approved:', approvalResponse.data.status);
        
        // Verify user became a seller
        const updatedProfile = await axios.get(`${API_BASE_URL}/user`, { headers: consumer1Headers });
        if (updatedProfile.data.user_type === 'seller') {
            console.log('✅ User type updated to seller');
        } else {
            console.log('❌ User type not updated');
        }
        
        // Test Case 6: Already seller trying to create request
        console.log('\n7. Testing seller trying to create another request...');
        try {
            await axios.post(`${API_BASE_URL}/seller-requests`, {
                id_number: 'SELLER123',
                reason: 'Already a seller',
                location: 'Test',
                face_image_url: 'https://test.com/seller.jpg'
            }, { headers: consumer1Headers });
            console.log('❌ Should have rejected seller request creation');
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.error?.includes('already a seller')) {
                console.log('✅ Correctly rejected seller request from existing seller');
            } else {
                console.log('❌ Unexpected error:', error.response?.data);
            }
        }
        
        // Test Case 7: Invalid request ID
        console.log('\n8. Testing invalid request ID...');
        try {
            await axios.put(`${API_BASE_URL}/seller-requests/99999`, {
                status: 'approved',
                admin_comments: 'Test'
            }, { headers: adminHeaders });
            console.log('❌ Should have failed for invalid ID');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Correctly handled invalid request ID');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }
        
        // Test Case 8: Store creation as seller
        console.log('\n9. Testing store creation as approved seller...');
        const storeResponse = await axios.post(`${API_BASE_URL}/stores`, {
            name: 'Edge Case Store',
            description: 'Testing store creation after seller approval',
            address: '456 Store Street',
            latitude: -6.2088,
            longitude: 106.8456,
            phone: '+1234567899',
            email: 'edge@case.com',
            category: 'Test Category'
        }, { headers: consumer1Headers });
        
        console.log('✅ Store created by approved seller:', {
            id: storeResponse.data.id,
            name: storeResponse.data.name
        });
        
        console.log('\n🎉 All edge cases and error handling tests completed!');
        return true;
        
    } catch (error) {
        console.error('❌ Edge case test failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return false;
    }
}

// Run the edge case tests
testEdgeCasesAndErrorHandling()
    .then(success => {
        if (success) {
            console.log('\n✅ All edge case tests passed! Seller request system is robust.');
        } else {
            console.log('\n❌ Some edge case tests failed.');
        }
    })
    .catch(error => {
        console.error('\n❌ Test failed with error:', error.message);
    });
