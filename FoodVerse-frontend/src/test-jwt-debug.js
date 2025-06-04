// Test script to debug JWT token and middleware issues
// Run this with: node test-jwt-debug.js

const { decode } = require('jsonwebtoken');

async function testJWTDebug() {
  console.log('🧪 Testing JWT Token Debugging...')
  
  const baseURL = 'http://localhost:7000/api/v1'
  
  // Login to get a token
  const loginResponse = await fetch(`${baseURL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'seller@foodverse.com',
      password: 'password123'
    })
  })
  
  if (!loginResponse.ok) {
    console.log('❌ Login failed')
    return
  }
  
  const loginData = await loginResponse.json()
  const token = loginData.token
  
  console.log('🔍 Full JWT Token:', token)
  
  // Try to decode the token (this is just for debugging, not verification)
  try {
    const parts = token.split('.')
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    
    console.log('📋 JWT Header:', header)
    console.log('📋 JWT Payload:', payload)
    
    // Check the current time vs expiry
    const now = Math.floor(Date.now() / 1000)
    console.log('⏰ Current time (Unix):', now)
    console.log('⏰ Token expires at (Unix):', payload.exp)
    console.log('⏰ Token is valid:', now < payload.exp)
    
  } catch (error) {
    console.log('❌ Failed to decode token:', error.message)
  }
  
  // Test different endpoints with the same token
  const endpoints = [
    { name: 'Profile', url: `${baseURL}/user`, method: 'GET' },
    { name: 'Seller Request Create', url: `${baseURL}/seller-requests`, method: 'POST', body: {
      id_number: '1234567890123456',
      location: 'Jakarta, Indonesia', 
      reason: 'Test request',
      face_image_url: 'test.jpg'
    }},
    { name: 'Get My Requests', url: `${baseURL}/seller-requests/my`, method: 'GET' }
  ]
  
  for (const endpoint of endpoints) {
    console.log(`\n🧪 Testing ${endpoint.name}...`)
    
    const requestOptions = {
      method: endpoint.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    
    if (endpoint.body) {
      requestOptions.body = JSON.stringify(endpoint.body)
    }
    
    try {
      const response = await fetch(endpoint.url, requestOptions)
      console.log(`📊 Status: ${response.status}`)
      console.log(`📊 Headers:`, Object.fromEntries(response.headers))
      
      const responseText = await response.text()
      console.log(`📊 Response:`, responseText)
      
    } catch (error) {
      console.log(`❌ Request failed:`, error.message)
    }
  }
  
  console.log('\n🏁 JWT debugging completed!')
}

// Polyfill for Buffer if not available in Node.js
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer
}

// Run the test
testJWTDebug()
