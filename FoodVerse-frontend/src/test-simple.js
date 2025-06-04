const API_BASE = 'http://localhost:7000/api/v1';

async function testBasicFlow() {
  console.log('🧪 Testing Basic API Flow...\n');

  // Test 1: User Registration
  console.log('1. Testing User Registration...');
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        user_type: 'seller'
      })
    });
    
    const result = await response.json();
    console.log('Registration Response:', result);
    
    if (result.token) {
      console.log('✅ Registration successful');
      
      // Test 2: Seller Request
      console.log('\n2. Testing Seller Request...');
      const sellerResponse = await fetch(`${API_BASE}/seller-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.token}`
        },
        body: JSON.stringify({
          id_number: 'ID123456789',
          reason: 'Test reason',
          location: 'Test location',
          face_image_url: 'https://example.com/face.jpg'
        })
      });
      
      const sellerText = await sellerResponse.text();
      console.log('Seller Request Response:', sellerText);
      
      // Test 3: Store Creation
      console.log('\n3. Testing Store Creation...');
      const storeResponse = await fetch(`${API_BASE}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.token}`
        },
        body: JSON.stringify({
          name: 'Test Store',
          description: 'Test description',
          address: 'Test address',
          latitude: -6.2088,
          longitude: 106.8456,
          phone: '+62123456789',
          category: 'restaurant',
          opening_hours: '09:00-22:00'
        })
      });
      
      const storeText = await storeResponse.text();
      console.log('Store Creation Response:', storeText);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBasicFlow();
