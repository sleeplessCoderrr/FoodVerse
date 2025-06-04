const API_BASE = 'http://localhost:7000/api/v1';

async function testUpdatedBackend() {
  console.log('🧪 Testing Updated Backend...\n');

  // Generate unique email
  const timestamp = Date.now();
  const email = `test-${timestamp}@example.com`;

  // Test 1: User Registration
  console.log('1. Testing User Registration...');
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User Updated',
        email: email,
        password: 'password123',
        user_type: 'seller'
      })
    });
    
    const result = await response.json();
    console.log('✅ Registration successful');
    console.log('Token:', result.token.substring(0, 20) + '...');
    
    if (result.token) {
      // Test 2: Seller Request
      console.log('\n2. Testing Seller Request with Auth...');
      const sellerResponse = await fetch(`${API_BASE}/seller-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.token}`
        },
        body: JSON.stringify({
          id_number: 'ID987654321',
          reason: 'I want to become a seller to help reduce food waste and grow my business on FoodVerse platform.',
          location: 'Jakarta, Indonesia',
          face_image_url: 'https://example.com/face-test.jpg'
        })
      });
      
      const sellerResult = await sellerResponse.text();
      console.log('Status:', sellerResponse.status);
      console.log('Response:', sellerResult);
      
      if (sellerResponse.ok) {
        console.log('✅ Seller request created successfully');
      } else {
        console.log('❌ Seller request failed');
      }
      
      // Test 3: Store Creation (Updated Response Format)
      console.log('\n3. Testing Store Creation...');
      const storeResponse = await fetch(`${API_BASE}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.token}`
        },
        body: JSON.stringify({
          name: 'Updated Test Store',
          description: 'Testing the updated response format',
          address: 'Updated Test Address',
          latitude: -6.2088,
          longitude: 106.8456,
          phone: '+62123456789',
          category: 'restaurant',
          opening_hours: '09:00-22:00'
        })
      });
      
      const storeResult = await storeResponse.json();
      console.log('Store Creation Response:');
      console.log(JSON.stringify(storeResult, null, 2));
      
      if (storeResponse.ok) {
        console.log('✅ Store created with proper response format');
      } else {
        console.log('❌ Store creation failed');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpdatedBackend();
