package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type SeedController struct {
	db *gorm.DB
}

func NewSeedController(db *gorm.DB) *SeedController {
	return &SeedController{db: db}
}

func (sc *SeedController) TriggerSeed(c *gin.Context) {
	// Call the seed function
	err := sc.seedDatabaseFixed()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Database seeded successfully"})
}

func (sc *SeedController) seedDatabaseFixed() error {
	fmt.Println("🌱 Starting manual database seeding...")

	// Check if already seeded
	var userCount int64
	sc.db.Model(&model.User{}).Count(&userCount)
	if userCount > 0 {
		return fmt.Errorf("database already contains users, skipping seed")
	}

	// Hash passwords
	adminHashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash admin password: %v", err)
	}

	password1, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	password2, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	password3, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	password4, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)

	// Create users - admin first, then sellers
	admin := model.User{
		Name:     "Admin User",
		Email:    "admin@foodverse.com",
		Password: string(adminHashedPassword),
		UserType: model.UserTypeAdmin,
		Phone:    "0000000000",
		Address:  "HQ",
	}
	if err := sc.db.Create(&admin).Error; err != nil {
		return fmt.Errorf("failed to create admin: %v", err)
	}

	sellers := []model.User{
		{Name: "Alice Owner", Email: "alice@store.com", Password: string(password1), UserType: model.UserTypeSeller, Phone: "1234567890", Address: "123 Main St"},
		{Name: "Bob Owner", Email: "bob@store.com", Password: string(password2), UserType: model.UserTypeSeller, Phone: "0987654321", Address: "456 Side St"},
		{Name: "Carol Owner", Email: "carol@store.com", Password: string(password3), UserType: model.UserTypeSeller, Phone: "1112223333", Address: "789 Market Ave"},
		{Name: "Dave Owner", Email: "dave@store.com", Password: string(password4), UserType: model.UserTypeSeller, Phone: "4445556666", Address: "321 River Rd"},
	}

	for i := range sellers {
		if err := sc.db.Create(&sellers[i]).Error; err != nil {
			return fmt.Errorf("failed to create seller %d: %v", i, err)
		}
	}

	// Create stores - assign to correct sellers (sellers[0], sellers[1], etc.)
	stores := []model.Store{
		{
			Name:        "Alice's Bakery",
			Description: "Fresh bread and pastries every day!",
			Address:     "123 Main St",
			Latitude:    -6.200000,
			Longitude:   106.816666,
			Phone:       "1234567890",
			Email:       "alice@store.com",
			Category:    "Bakery",
			ImageURL:    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
			Rating:      4.8,
			IsActive:    true,
			OwnerID:     sellers[0].ID, // Alice
		},
		{
			Name:        "Bob's Cafe",
			Description: "Cozy cafe with the best coffee in town.",
			Address:     "456 Side St",
			Latitude:    -6.210000,
			Longitude:   106.820000,
			Phone:       "0987654321",
			Email:       "bob@store.com",
			Category:    "Cafe",
			ImageURL:    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80",
			Rating:      4.6,
			IsActive:    true,
			OwnerID:     sellers[1].ID, // Bob
		},
		{
			Name:        "Carol's Deli",
			Description: "Delicious sandwiches and deli treats.",
			Address:     "789 Market Ave",
			Latitude:    -6.220000,
			Longitude:   106.830000,
			Phone:       "1112223333",
			Email:       "carol@store.com",
			Category:    "Deli",
			ImageURL:    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
			Rating:      4.7,
			IsActive:    true,
			OwnerID:     sellers[2].ID, // Carol
		},
		{
			Name:        "Dave's Grill",
			Description: "Grilled specialties and hearty meals.",
			Address:     "321 River Rd",
			Latitude:    -6.230000,
			Longitude:   106.840000,
			Phone:       "4445556666",
			Email:       "dave@store.com",
			Category:    "Grill",
			ImageURL:    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
			Rating:      4.5,
			IsActive:    true,
			OwnerID:     sellers[3].ID, // Dave
		},
	}

	for i := range stores {
		if err := sc.db.Create(&stores[i]).Error; err != nil {
			return fmt.Errorf("failed to create store %d: %v", i, err)
		}
	}

	// Create food bags for each store
	for i, store := range stores {
		var foodBags []model.FoodBag

		switch i {
		case 0: // Alice's Bakery
			foodBags = []model.FoodBag{
				{Title: "Sourdough Bread Bag", Description: "Fresh sourdough bread loaves", OriginalPrice: 50.0, DiscountedPrice: 25.0, QuantityTotal: 10, QuantityLeft: 10, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80", Category: "Bakery", IsActive: true, StoreID: store.ID},
				{Title: "Pastry Assortment", Description: "Mixed pastries: croissants, danishes", OriginalPrice: 40.0, DiscountedPrice: 20.0, QuantityTotal: 8, QuantityLeft: 8, PickupTimeStart: time.Now().Add(3 * time.Hour), PickupTimeEnd: time.Now().Add(5 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=400&q=80", Category: "Bakery", IsActive: true, StoreID: store.ID},
			}
		case 1: // Bob's Cafe
			foodBags = []model.FoodBag{
				{Title: "Coffee & Croissant Combo", Description: "Croissant and coffee", OriginalPrice: 30.0, DiscountedPrice: 15.0, QuantityTotal: 15, QuantityLeft: 15, PickupTimeStart: time.Now().Add(1 * time.Hour), PickupTimeEnd: time.Now().Add(3 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?auto=format&fit=crop&w=400&q=80", Category: "Cafe", IsActive: true, StoreID: store.ID},
				{Title: "Latte & Muffin", Description: "Latte and blueberry muffin", OriginalPrice: 25.0, DiscountedPrice: 12.0, QuantityTotal: 10, QuantityLeft: 10, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80", Category: "Cafe", IsActive: true, StoreID: store.ID},
			}
		case 2: // Carol's Deli
			foodBags = []model.FoodBag{
				{Title: "Deli Sandwich Pack", Description: "Assorted deli sandwiches", OriginalPrice: 40.0, DiscountedPrice: 20.0, QuantityTotal: 10, QuantityLeft: 10, PickupTimeStart: time.Now().Add(1 * time.Hour), PickupTimeEnd: time.Now().Add(3 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=400&q=80", Category: "Deli", IsActive: true, StoreID: store.ID},
				{Title: "Meat & Cheese Platter", Description: "Platter of meats and cheeses", OriginalPrice: 50.0, DiscountedPrice: 25.0, QuantityTotal: 8, QuantityLeft: 8, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1544384402-4bea3e6f7de1?auto=format&fit=crop&w=400&q=80", Category: "Deli", IsActive: true, StoreID: store.ID},
			}
		case 3: // Dave's Grill
			foodBags = []model.FoodBag{
				{Title: "Grilled Chicken Box", Description: "Grilled chicken with sides", OriginalPrice: 55.0, DiscountedPrice: 28.0, QuantityTotal: 10, QuantityLeft: 10, PickupTimeStart: time.Now().Add(1 * time.Hour), PickupTimeEnd: time.Now().Add(3 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=400&q=80", Category: "Grill", IsActive: true, StoreID: store.ID},
				{Title: "BBQ Ribs Pack", Description: "Tender BBQ ribs", OriginalPrice: 60.0, DiscountedPrice: 30.0, QuantityTotal: 8, QuantityLeft: 8, PickupTimeStart: time.Now().Add(2 * time.Hour), PickupTimeEnd: time.Now().Add(4 * time.Hour), ImageURL: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80", Category: "Grill", IsActive: true, StoreID: store.ID},
			}
		}

		for j := range foodBags {
			if err := sc.db.Create(&foodBags[j]).Error; err != nil {
				return fmt.Errorf("failed to create food bag %d for store %d: %v", j, i, err)
			}
		}
	}

	fmt.Println("✅ Database seeded successfully with proper foreign keys!")
	return nil
}
