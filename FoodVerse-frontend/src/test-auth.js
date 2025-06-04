// Test script to verify authentication API integration
// Run this in browser console on localhost:5174

async function testAuth() {
  console.log('🧪 Testing Authentication API Integration...')
  
  const baseURL = 'http://localhost:7000/api/v1'
  
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@foodverse.com',
    password: 'password123',
    phone: '1234567890'
  }
  
  try {
    console.log('1️⃣ Testing Registration...')
    const registerResponse = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    })
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json()
      console.log('✅ Registration successful:', registerData)
      
      // Store token for further tests
      const token = registerData.data.token
      
      console.log('2️⃣ Testing Profile endpoint...')
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
        console.log('❌ Profile fetch failed:', await profileResponse.text())
      }
      
      console.log('3️⃣ Testing Login...')
      const loginResponse = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      })
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        console.log('✅ Login successful:', loginData)
      } else {
        console.log('❌ Login failed:', await loginResponse.text())
      }
      
    } else {
      const errorText = await registerResponse.text()
      console.log('❌ Registration failed:', errorText)
      
      // If registration failed due to existing user, try login
      if (registerResponse.status === 400 || registerResponse.status === 409) {
        console.log('🔄 User might already exist, trying login...')
        const loginResponse = await fetch(`${baseURL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: testUser.email,
            password: testUser.password
          })
        })
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          console.log('✅ Login successful with existing user:', loginData)
        } else {
          console.log('❌ Login also failed:', await loginResponse.text())
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
  
  console.log('🏁 Authentication tests completed!')
}

// Run the test
testAuth()
