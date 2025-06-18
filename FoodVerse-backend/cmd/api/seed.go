package main

// import (
// 	"fmt"
// 	"time"

// 	"github.com/FoodVerse/FoodVerse-backend/internal/config"
// 	"github.com/FoodVerse/FoodVerse-backend/internal/model"
// 	"github.com/FoodVerse/FoodVerse-backend/pkg/database"
// 	"golang.org/x/crypto/bcrypt"
// )

// func main() {
// 	cfg, err := config.LoadConfig()
// 	if err != nil {
// 		panic("failed to load config: " + err.Error())
// 	}

// 	db, err := database.NewConnection(cfg)
// 	if err != nil {
// 		panic("failed to connect to database: " + err.Error())
// 	}

// 	// Drop all tables
// 	db.Migrator().DropTable(&model.Order{}, &model.FoodBag{}, &model.Store{}, &model.User{})
// 	// Migrate all tables
// 	db.AutoMigrate(&model.User{}, &model.Store{}, &model.FoodBag{}, &model.Order{})

// 	// Hash the admin password
// 	adminHashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
// 	if err != nil {
// 		panic("failed to hash admin password: " + err.Error())
// 	}

// 	// Hash other passwords too for consistency
// 	password1, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
// 	password2, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
// 	password3, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
// 	password4, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)

// 	// Seed users (store owners and admin)
// 	owners := []model.User{
// 		{Name: "Admin User", Email: "admin@foodverse.com", Password: string(adminHashedPassword), UserType: model.UserTypeAdmin, Phone: "0000000000", Address: "HQ"},
// 		{Name: "Alice Owner", Email: "alice@store.com", Password: string(password1), UserType: model.UserTypeSeller, Phone: "1234567890", Address: "123 Main St"},
// 		{Name: "Bob Owner", Email: "bob@store.com", Password: string(password2), UserType: model.UserTypeSeller, Phone: "0987654321", Address: "456 Side St"},
// 		{Name: "Carol Owner", Email: "carol@store.com", Password: string(password3), UserType: model.UserTypeSeller, Phone: "1112223333", Address: "789 Market Ave"},
// 		{Name: "Dave Owner", Email: "dave@store.com", Password: string(password4), UserType: model.UserTypeSeller, Phone: "4445556666", Address: "321 River Rd"},
// 	}
// 	for i := range owners {
// 		db.Create(&owners[i])
// 	}

// 	// Seed stores
// 	stores := []model.Store{
// 		{
// 			Name:        "Alice's Bakery",
// 			Description: "Fresh bread and pastries every day!",
// 			Address:     "123 Main St",
// 			Latitude:    -6.200000,
// 			Longitude:   106.816666,
// 			Phone:       "1234567890",
// 			Email:       "alice@store.com",
// 			Category:    "Bakery",
// 			ImageURL:    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
// 			Rating:      4.8,
// 			IsActive:    true,
// 			OwnerID:     owners[0].ID,
// 		},
// 		{
// 			Name:        "Bob's Cafe",
// 			Description: "Cozy cafe with the best coffee in town.",
// 			Address:     "456 Side St",
// 			Latitude:    -6.210000,
// 			Longitude:   106.820000,
// 			Phone:       "0987654321",
// 			Email:       "bob@store.com",
// 			Category:    "Cafe",
// 			ImageURL:    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
// 			Rating:      4.6,
// 			IsActive:    true,
// 			OwnerID:     owners[1].ID,
// 		},
// 		{
// 			Name:        "Carol's Deli",
// 			Description: "Delicious sandwiches and deli treats.",
// 			Address:     "789 Market Ave",
// 			Latitude:    -6.220000,
// 			Longitude:   106.830000,
// 			Phone:       "1112223333",
// 			Email:       "carol@store.com",
// 			Category:    "Deli",
// 			ImageURL:    "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6f?auto=format&fit=crop&w=400&q=80",
// 			Rating:      4.7,
// 			IsActive:    true,
// 			OwnerID:     owners[2].ID,
// 		},
// 		{
// 			Name:        "Dave's Grill",
// 			Description: "Grilled specialties and hearty meals.",
// 			Address:     "321 River Rd",
// 			Latitude:    -6.230000,
// 			Longitude:   106.840000,
// 			Phone:       "4445556666",
// 			Email:       "dave@store.com",
// 			Category:    "Grill",
// 			ImageURL:    "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
// 			Rating:      4.5,
// 			IsActive:    true,
// 			OwnerID:     owners[3].ID,
// 		},
// 	}
// 	for i := range stores {
// 		db.Create(&stores[i])
// 	}

// 	// Seed food bags for each store (5 per store)
// 	foodBags := [][]model.FoodBag{
// 		{
// 			{Title: "Sourdough Bread Bag", Description: "A bag of fresh sourdough bread loaves.", OriginalPrice: 50.0, DiscountedPrice: 25.0, QuantityTotal: 10, QuantityLeft: 10, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", Category: "Bakery", IsActive: true},
// 			{Title: "Pastry Assortment", Description: "Mixed pastries: croissants, danishes, and more.", OriginalPrice: 40.0, DiscountedPrice: 20.0, QuantityTotal: 8, QuantityLeft: 8, PickupTimeStart: time.Now().Add(3 * time.Hour), PickupTimeEnd: time.Now().Add(5 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80", Category: "Bakery", IsActive: true},
// 			{Title: "Bagel Bundle", Description: "Fresh bagels with cream cheese.", OriginalPrice: 30.0, DiscountedPrice: 15.0, QuantityTotal: 12, QuantityLeft: 12, PickupTimeStart: time.Now().Add(1 * time.Hour), PickupTimeEnd: time.Now().Add(3 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1504674900247-ec6b0b4783e4?auto=format&fit=crop&w=400&q=80", Category: "Bakery", IsActive: true},
// 			{Title: "Sweet Treats", Description: "Cakes and cookies selection.", OriginalPrice: 35.0, DiscountedPrice: 18.0, QuantityTotal: 9, QuantityLeft: 9, PickupTimeStart: time.Now().Add(4 * time.Hour), PickupTimeEnd: time.Now().Add(6 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80", Category: "Bakery", IsActive: true},
// 			{Title: "Breadsticks Pack", Description: "Crunchy breadsticks, perfect for snacks.", OriginalPrice: 20.0, DiscountedPrice: 10.0, QuantityTotal: 15, QuantityLeft: 15, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", Category: "Bakery", IsActive: true},
// 		},
// 		{
// 			{Title: "Coffee & Croissant Combo", Description: "Enjoy a croissant and a cup of coffee.", OriginalPrice: 30.0, DiscountedPrice: 15.0, QuantityTotal: 15, QuantityLeft: 15, PickupTimeStart: time.Now().Add(1 * time.Hour), PickupTimeEnd: time.Now().Add(3 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1504674900247-ec6b0b4783e4?auto=format&fit=crop&w=400&q=80", Category: "Cafe", IsActive: true},
// 			{Title: "Latte & Muffin", Description: "A latte and a blueberry muffin.", OriginalPrice: 25.0, DiscountedPrice: 12.0, QuantityTotal: 10, QuantityLeft: 10, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80", Category: "Cafe", IsActive: true},
// 			{Title: "Espresso Shot Pack", Description: "3 shots of espresso.", OriginalPrice: 18.0, DiscountedPrice: 9.0, QuantityTotal: 20, QuantityLeft: 20, PickupTimeStart: time.Now().Add(3 * time.Hour), PickupTimeEnd: time.Now().Add(5 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80", Category: "Cafe", IsActive: true},
// 			{Title: "Vegan Snack Box", Description: "Healthy vegan snacks.", OriginalPrice: 22.0, DiscountedPrice: 11.0, QuantityTotal: 12, QuantityLeft: 12, PickupTimeStart: time.Now().Add(4 * time.Hour), PickupTimeEnd: time.Now().Add(6 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6f?auto=format&fit=crop&w=400&q=80", Category: "Cafe", IsActive: true},
// 			{Title: "Coffee Sampler", Description: "Sample 3 types of coffee.", OriginalPrice: 28.0, DiscountedPrice: 14.0, QuantityTotal: 8, QuantityLeft: 8, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80", Category: "Cafe", IsActive: true},
// 		},
// 		{
// 			{Title: "Deli Sandwich Pack", Description: "Assorted deli sandwiches.", OriginalPrice: 40.0, DiscountedPrice: 20.0, QuantityTotal: 10, QuantityLeft: 10, PickupTimeStart: time.Now().Add(1 * time.Hour), PickupTimeEnd: time.Now().Add(3 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6f?auto=format&fit=crop&w=400&q=80", Category: "Deli", IsActive: true},
// 			{Title: "Meat & Cheese Platter", Description: "A platter of meats and cheeses.", OriginalPrice: 50.0, DiscountedPrice: 25.0, QuantityTotal: 8, QuantityLeft: 8, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80", Category: "Deli", IsActive: true},
// 			{Title: "Salad Box", Description: "Fresh salads with dressing.", OriginalPrice: 30.0, DiscountedPrice: 15.0, QuantityTotal: 12, QuantityLeft: 12, PickupTimeStart: time.Now().Add(3 * time.Hour), PickupTimeEnd: time.Now().Add(5 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", Category: "Deli", IsActive: true},
// 			{Title: "Wraps Selection", Description: "Assorted wraps: chicken, beef, veggie.", OriginalPrice: 35.0, DiscountedPrice: 18.0, QuantityTotal: 9, QuantityLeft: 9, PickupTimeStart: time.Now().Add(4 * time.Hour), PickupTimeEnd: time.Now().Add(6 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80", Category: "Deli", IsActive: true},
// 			{Title: "Snack Platter", Description: "Chips, dips, and more.", OriginalPrice: 20.0, DiscountedPrice: 10.0, QuantityTotal: 15, QuantityLeft: 15, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80", Category: "Deli", IsActive: true},
// 		},
// 		{
// 			{Title: "Grilled Chicken Box", Description: "Grilled chicken with sides.", OriginalPrice: 55.0, DiscountedPrice: 28.0, QuantityTotal: 10, QuantityLeft: 10, PickupTimeStart: time.Now().Add(1 * time.Hour), PickupTimeEnd: time.Now().Add(3 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80", Category: "Grill", IsActive: true},
// 			{Title: "BBQ Ribs Pack", Description: "Tender BBQ ribs.", OriginalPrice: 60.0, DiscountedPrice: 30.0, QuantityTotal: 8, QuantityLeft: 8, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6f?auto=format&fit=crop&w=400&q=80", Category: "Grill", IsActive: true},
// 			{Title: "Burger Combo", Description: "Burger, fries, and drink.", OriginalPrice: 35.0, DiscountedPrice: 18.0, QuantityTotal: 12, QuantityLeft: 12, PickupTimeStart: time.Now().Add(3 * time.Hour), PickupTimeEnd: time.Now().Add(5 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80", Category: "Grill", IsActive: true},
// 			{Title: "Veggie Grill Box", Description: "Grilled veggies and tofu.", OriginalPrice: 32.0, DiscountedPrice: 16.0, QuantityTotal: 9, QuantityLeft: 9, PickupTimeStart: time.Now().Add(4 * time.Hour), PickupTimeEnd: time.Now().Add(6 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", Category: "Grill", IsActive: true},
// 			{Title: "Family Grill Feast", Description: "Grilled meats for the whole family.", OriginalPrice: 80.0, DiscountedPrice: 40.0, QuantityTotal: 6, QuantityLeft: 6, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80", Category: "Grill", IsActive: true},
// 		},
// 	}
// 	for i, store := range stores {
// 		for j := range foodBags[i] {
// 			foodBags[i][j].StoreID = store.ID
// 			db.Create(&foodBags[i][j])
// 		}
// 	}

// 	fmt.Println("Database reset and seeded successfully with 4 stores and 5 bags each!")
// }
