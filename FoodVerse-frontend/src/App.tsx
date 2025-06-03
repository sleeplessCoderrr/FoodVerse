import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500">
      {/* Navigation */}
      <nav className="backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍽️</span>
              <h1 className="text-2xl font-bold text-white">FoodVerse</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-purple-200 transition-colors">
                Login
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Save Food, Save Money
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Discover surplus food from local restaurants and cafes at amazing prices
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter your location..."
                    className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
                  Find Food
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { emoji: '🥖', name: 'Bakery', count: 25 },
              { emoji: '🍽️', name: 'Restaurant', count: 42 },
              { emoji: '🛒', name: 'Grocery', count: 18 },
              { emoji: '☕', name: 'Café', count: 31 }
            ].map((category) => (
              <div key={category.name} className="backdrop-blur-lg bg-white/10 rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105">
                <div className="text-4xl mb-2">{category.emoji}</div>
                <h4 className="text-white font-semibold">{category.name}</h4>
                <p className="text-white/70 text-sm">{category.count} stores</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Our Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">12,543</div>
              <div className="text-white/70">Meals Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">8.2 tons</div>
              <div className="text-white/70">CO₂ Reduced</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">€45,210</div>
              <div className="text-white/70">Money Saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
