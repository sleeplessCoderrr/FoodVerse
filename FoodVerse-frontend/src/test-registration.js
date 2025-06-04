#!/usr/bin/env node

import axios from 'axios';

const API_BASE_URL = 'http://localhost:7000/api/v1';

async function testRegistration() {
    console.log('🧪 Testing Registration Flow...\n');
    
    // Test 1: Valid registration
    try {
        console.log('📝 Test 1: Valid registration');
        const registerData = {
            name: 'Test Registration User',
            email: `test-${Date.now()}@example.com`, // Unique email
            password: 'password123',
            user_type: 'consumer',
            phone: '+62-21-1234567',
            address: 'Test Address, Jakarta'
        };
        
        console.log('Sending registration request...');
        const response = await axios.post(`${API_BASE_URL}/register`, registerData);
        
        console.log('✅ Registration successful!');
        console.log('Response:', {
            user: response.data.user,
            hasToken: !!response.data.token,
            tokenLength: response.data.token ? response.data.token.length : 0
        });
        
        // Test profile endpoint with the token
        console.log('\n🔍 Testing profile endpoint...');
        const profileResponse = await axios.get(`${API_BASE_URL}/user`, {
            headers: {
                'Authorization': `Bearer ${response.data.token}`
            }
        });
        
        console.log('✅ Profile fetch successful!');
        console.log('Profile data:', profileResponse.data);
        
    } catch (error) {
        console.log('❌ Registration test failed:');
        if (error.response) {
            console.log('Error response:', error.response.data);
            console.log('Status:', error.response.status);
        } else {
            console.log('Error:', error.message);
        }
    }
    
    // Test 2: Duplicate email
    try {
        console.log('\n📝 Test 2: Duplicate email registration');
        const duplicateData = {
            name: 'Duplicate User',
            email: 'consumer@test.com', // This email already exists
            password: 'password123',
            user_type: 'consumer'
        };
        
        const response = await axios.post(`${API_BASE_URL}/register`, duplicateData);
        console.log('❌ Duplicate registration should have failed but succeeded');
        
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log('✅ Duplicate email correctly rejected');
            console.log('Error message:', error.response.data.error);
        } else {
            console.log('❌ Unexpected error:', error.message);
        }
    }
    
    // Test 3: Invalid data
    try {
        console.log('\n📝 Test 3: Invalid data (missing required fields)');
        const invalidData = {
            name: '',
            email: 'invalid-email',
            password: '123', // Too short
            user_type: 'invalid-type'
        };
        
        const response = await axios.post(`${API_BASE_URL}/register`, invalidData);
        console.log('❌ Invalid data should have failed but succeeded');
        
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log('✅ Invalid data correctly rejected');
            console.log('Error message:', error.response.data.error);
        } else {
            console.log('❌ Unexpected error:', error.message);
        }
    }
    
    console.log('\n🎉 Registration testing completed!');
}

// Run the test
testRegistration().catch(console.error);
