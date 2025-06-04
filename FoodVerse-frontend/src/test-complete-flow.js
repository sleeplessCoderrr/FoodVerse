#!/usr/bin/env node

import axios from 'axios';

const FRONTEND_URL = 'http://localhost:5173';
const API_BASE_URL = 'http://localhost:7000/api/v1';

async function testCompleteFlow() {
    console.log('🚀 Testing Complete FoodVerse Application Flow...\n');
    
    // Test 1: Register a new consumer
    console.log('📝 Test 1: Consumer Registration');
    try {
        const consumerEmail = `consumer-${Date.now()}@test.com`;
        const consumerData = {
            name: 'Test Consumer',
            email: consumerEmail,
            password: 'password123',
            user_type: 'consumer',
            phone: '+62-21-1111111',
            address: 'Consumer Address, Jakarta'
        };
        
        const consumerResponse = await axios.post(`${API_BASE_URL}/register`, consumerData);
        console.log('✅ Consumer registered successfully');
        console.log(`📧 Consumer email: ${consumerEmail}`);
        
        const consumerToken = consumerResponse.data.token;
        
        // Test consumer can access profile
        const consumerProfile = await axios.get(`${API_BASE_URL}/user`, {
            headers: { 'Authorization': `Bearer ${consumerToken}` }
        });
        console.log('✅ Consumer profile access working');
        
    } catch (error) {
        console.log('❌ Consumer registration failed:', error.response?.data || error.message);
    }
    
    // Test 2: Register a new business user
    console.log('\n📝 Test 2: Business Registration');
    try {
        const businessEmail = `business-${Date.now()}@test.com`;
        const businessData = {
            name: 'Test Business Owner',
            email: businessEmail,
            password: 'password123',
            user_type: 'business',
            phone: '+62-21-2222222',
            address: 'Business Address, Jakarta'
        };
        
        const businessResponse = await axios.post(`${API_BASE_URL}/register`, businessData);
        console.log('✅ Business user registered successfully');
        console.log(`📧 Business email: ${businessEmail}`);
        
        const businessToken = businessResponse.data.token;
        
        // Test business user can create a store
        console.log('🏪 Testing store creation...');
        const storeData = {
            name: 'Test Restaurant',
            description: 'A test restaurant for validation',
            address: '123 Test Street, Jakarta',
            latitude: -6.2088,
            longitude: 106.8456,
            phone: '+62-21-3333333',
            email: 'test@restaurant.com',
            category: 'restaurant',
            image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'
        };
        
        const storeResponse = await axios.post(`${API_BASE_URL}/stores`, storeData, {
            headers: { 'Authorization': `Bearer ${businessToken}` }
        });
        console.log('✅ Store created successfully');
        console.log(`🏪 Store ID: ${storeResponse.data.ID}`);
        
        // Test business user can create food bags
        console.log('🥘 Testing food bag creation...');
        const foodBagData = {
            store_id: storeResponse.data.ID,
            title: 'Test Food Bag',
            description: 'A test food bag for validation',
            original_price: 20.00,
            discounted_price: 10.00,
            quantity_total: 5,
            pickup_time_start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            pickup_time_end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
            image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
            category: 'restaurant'
        };
        
        const foodBagResponse = await axios.post(`${API_BASE_URL}/food-bags`, foodBagData, {
            headers: { 'Authorization': `Bearer ${businessToken}` }
        });
        console.log('✅ Food bag created successfully');
        console.log(`🥘 Food bag ID: ${foodBagResponse.data.ID}`);
        
    } catch (error) {
        console.log('❌ Business workflow failed:', error.response?.data || error.message);
    }
    
    // Test 3: Search functionality (no auth required)
    console.log('\n📝 Test 3: Search Functionality');
    try {
        // Search stores
        const storeSearchParams = {
            latitude: -6.2088,
            longitude: 106.8456,
            radius: 10
        };
        
        const storeSearchResponse = await axios.post(`${API_BASE_URL}/stores/search`, storeSearchParams);
        console.log(`✅ Store search successful - Found ${storeSearchResponse.data.length} stores`);
        
        // Search food bags
        const foodBagSearchParams = {
            latitude: -6.2088,
            longitude: 106.8456,
            radius: 10
        };
        
        const foodBagSearchResponse = await axios.post(`${API_BASE_URL}/food-bags/search`, foodBagSearchParams);
        console.log(`✅ Food bag search successful - Found ${foodBagSearchResponse.data.length} food bags`);
        
    } catch (error) {
        console.log('❌ Search functionality failed:', error.response?.data || error.message);
    }
    
    console.log('\n🎉 Complete application flow testing finished!');
    console.log('\n📱 Frontend URLs to test:');
    console.log(`   Registration: ${FRONTEND_URL}/register`);
    console.log(`   Login: ${FRONTEND_URL}/login`);
    console.log(`   Dashboard: ${FRONTEND_URL}/dashboard`);
    console.log('\n🔧 Test Accounts (use these to login):');
    console.log('   Consumer: consumer@test.com / password123');
    console.log('   Business: business@test.com / password123');
}

// Run the test
testCompleteFlow().catch(console.error);
