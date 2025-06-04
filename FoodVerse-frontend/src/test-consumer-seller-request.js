// Test seller request creation with a consumer account
// Run this with: node test-consumer-seller-request.js

async function testConsumerSellerRequest() {
  console.log('🧪 Testing Seller Request Creation with Consumer Account...')
  
  const baseURL = 'http://localhost:7000/api/v1'
  
  // Test consumer user data
  const testConsumer = {
    name: 'Test Consumer',
    email: 'consumer@foodverse.com',
    password: 'password123',
    phone: '1234567890',
    user_type: 'consumer'
  }
  
  try {
    console.log('1️⃣ Testing Consumer Registration...')
    let token = null
    
    // Try registration first
    const registerResponse = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testConsumer)
    })
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json()
      console.log('✅ Consumer registration successful')
      token = registerData.token
    } else {
      const errorText = await registerResponse.text()
      console.log('🔄 Registration failed (user might exist):', errorText)
      
      // Try login instead
      console.log('2️⃣ Trying Consumer Login...')
      const loginResponse = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testConsumer.email,
          password: testConsumer.password
        })
      })
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        console.log('✅ Consumer login successful')
        token = loginData.token
      } else {
        const loginError = await loginResponse.text()
        console.log('❌ Consumer login failed:', loginError)
        return
      }
    }
    
    if (!token) {
      console.log('❌ No token available for testing')
      return
    }
    
    console.log('3️⃣ Testing Seller Request Creation...')
    const sellerRequestData = {
      id_number: '1234567890123456',
      location: 'Jakarta, Indonesia',
      reason: 'I want to sell delicious food to my community and reduce food waste',
      face_image_url: 'https://example.com/face.jpg'
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
    
    console.log('4️⃣ Testing Get My Seller Requests...')
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
  
  console.log('🏁 Consumer seller request tests completed!')
}

// Run the test
testConsumerSellerRequest()
