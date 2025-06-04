// Test script to specifically test seller authentication and requests
// Run this with: node test-seller-auth.js

async function testSellerAuth() {
  console.log('🧪 Testing Seller Authentication & Request Flow...')
  
  const baseURL = 'http://localhost:7000/api/v1'
  
  // Test seller user data
  const testSeller = {
    name: 'Test Seller',
    email: 'seller@foodverse.com',
    password: 'password123',
    phone: '9876543210',
    user_type: 'seller'
  }
  
  try {
    console.log('1️⃣ Testing Seller Registration...')
    let token = null
    
    // Try registration first
    const registerResponse = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testSeller)
    })
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json()
      console.log('✅ Seller registration successful:', registerData)
      token = registerData.token
    } else {
      const errorText = await registerResponse.text()
      console.log('🔄 Registration failed (user might exist):', errorText)
      
      // Try login instead
      console.log('2️⃣ Trying Seller Login...')
      const loginResponse = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testSeller.email,
          password: testSeller.password
        })
      })
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        console.log('✅ Seller login successful:', loginData)
        token = loginData.token
      } else {
        const loginError = await loginResponse.text()
        console.log('❌ Seller login failed:', loginError)
        return
      }
    }
    
    if (!token) {
      console.log('❌ No token available for testing')
      return
    }
    
    console.log('3️⃣ Testing JWT Token:', token.substring(0, 50) + '...')
    
    console.log('4️⃣ Testing Profile Endpoint...')
    const profileResponse = await fetch(`${baseURL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json()
      console.log('✅ Profile fetch successful:', profileData)
    } else {
      console.log('❌ Profile fetch failed:', profileResponse.status, await profileResponse.text())
    }
    
    console.log('5️⃣ Testing Seller Request Creation...')
    const sellerRequestData = {
      id_number: '1234567890123456',
      location: 'Jakarta, Indonesia',
      reason: 'I want to sell delicious food to my community',
      face_image_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVR'
    }
    
    const sellerRequestResponse = await fetch(`${baseURL}/seller-requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sellerRequestData)
    })
    
    console.log('📊 Seller Request Response Status:', sellerRequestResponse.status)
    
    if (sellerRequestResponse.ok) {
      const requestData = await sellerRequestResponse.json()
      console.log('✅ Seller request created successfully:', requestData)
    } else {
      const errorText = await sellerRequestResponse.text()
      console.log('❌ Seller request failed:', errorText)
    }
    
    console.log('6️⃣ Testing Get My Seller Requests...')
    const getRequestsResponse = await fetch(`${baseURL}/seller-requests/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (getRequestsResponse.ok) {
      const requestsData = await getRequestsResponse.json()
      console.log('✅ Get my requests successful:', requestsData)
    } else {
      console.log('❌ Get my requests failed:', getRequestsResponse.status, await getRequestsResponse.text())
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message)
    console.error(error)
  }
  
  console.log('🏁 Seller authentication tests completed!')
}

// Run the test
testSellerAuth()
