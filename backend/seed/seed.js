import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

// Import models
import User from "../models/auth.model.js";
import Hotel from "../models/hotel.model.js";
import Location from "../models/location.model.js";
import FoodOption from "../models/foodOption.model.js";
import Package from "../models/package.model.js";
import Booking from "../models/booking.model.js";
import PackageReviews from "../models/packageReviews.model.js";
import GalleryImage from "../models/gallery.model.js";

// Import seed data
import {
  usersData,
  hotelsData,
  locationsData,
  foodOptionsData,
} from "./seedData.js";

dotenv.config({ path: "./.env" });

// Hash password helper
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Generate packages data based on created hotels, locations, and food options
const generatePackagesData = () => {
  const packages = [
    {
      name: "Mumbai Heritage Tour",
      description: "Explore the vibrant city of Mumbai with its rich history and culture. Visit iconic landmarks and experience the local lifestyle.",
      basePrice: 25000,
      durationDays: 3,
      isRecommended: true,
      bestSeason: "winter",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Dubai Luxury Experience",
      description: "Experience the opulence of Dubai with world-class hotels, shopping, and entertainment. Perfect for a luxurious getaway.",
      basePrice: 50000,
      durationDays: 4,
      isRecommended: true,
      bestSeason: "winter",
      country: "UAE",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Delhi Cultural Journey",
      description: "Discover the capital city of India with its historical monuments, vibrant markets, and rich cultural heritage.",
      basePrice: 20000,
      durationDays: 3,
      isRecommended: false,
      bestSeason: "winter",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Rajasthan Royal Tour",
      description: "Explore the royal state of Rajasthan with its magnificent forts, palaces, and desert landscapes.",
      basePrice: 30000,
      durationDays: 5,
      isRecommended: true,
      bestSeason: "winter",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Goa Beach Paradise",
      description: "Relax on pristine beaches, enjoy water sports, and experience the laid-back Goan lifestyle.",
      basePrice: 18000,
      durationDays: 4,
      isRecommended: false,
      bestSeason: "winter",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Desert Adventure Jaisalmer",
      description: "Experience the magic of the Thar Desert with camel safaris, desert camping, and cultural performances.",
      basePrice: 15000,
      durationDays: 3,
      isRecommended: false,
      bestSeason: "winter",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Mumbai & Goa Combo",
      description: "Combine the hustle of Mumbai with the tranquility of Goa beaches in one amazing trip.",
      basePrice: 35000,
      durationDays: 6,
      isRecommended: true,
      bestSeason: "winter",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Dubai Shopping Extravaganza",
      description: "Shop till you drop in Dubai's world-famous malls and souks, combined with luxury hotel stays.",
      basePrice: 45000,
      durationDays: 5,
      isRecommended: false,
      bestSeason: "all",
      country: "UAE",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Golden Triangle Tour",
      description: "Visit Delhi, Agra, and Jaipur - the three most iconic cities of North India.",
      basePrice: 28000,
      durationDays: 5,
      isRecommended: true,
      bestSeason: "winter",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Mumbai Weekend Getaway",
      description: "Perfect weekend escape to Mumbai with quick city tours and relaxation.",
      basePrice: 12000,
      durationDays: 2,
      isRecommended: false,
      bestSeason: "all",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Dubai Family Fun",
      description: "Family-friendly Dubai tour with theme parks, aquariums, and kid-friendly activities.",
      basePrice: 55000,
      durationDays: 5,
      isRecommended: false,
      bestSeason: "winter",
      country: "UAE",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Rajasthan Desert & Palaces",
      description: "Explore the royal heritage of Rajasthan with desert experiences and palace visits.",
      basePrice: 32000,
      durationDays: 6,
      isRecommended: true,
      bestSeason: "winter",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Goa Monsoon Special",
      description: "Experience Goa during monsoon with lush greenery and fewer crowds.",
      basePrice: 15000,
      durationDays: 4,
      isRecommended: false,
      bestSeason: "monsoon",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Mumbai Business & Leisure",
      description: "Combine business meetings with leisure activities in India's financial capital.",
      basePrice: 22000,
      durationDays: 3,
      isRecommended: false,
      bestSeason: "all",
      country: "India",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
    {
      name: "Dubai Luxury & Adventure",
      description: "Mix luxury experiences with adventure activities like desert safaris and skydiving.",
      basePrice: 60000,
      durationDays: 6,
      isRecommended: true,
      bestSeason: "winter",
      country: "UAE",
      images: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
    },
  ];

  return packages;
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Location.deleteMany({});
    await FoodOption.deleteMany({});
    await Package.deleteMany({});
    await Booking.deleteMany({});
    await PackageReviews.deleteMany({});
    await GalleryImage.deleteMany({});
    console.log("✅ Existing data cleared");

    // Seed Users
    console.log("👥 Seeding users...");
    const hashedUsersData = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await hashPassword("password123"),
      }))
    );
    const users = await User.insertMany(hashedUsersData);
    console.log(`✅ Created ${users.length} users`);

    // Seed Hotels
    console.log("🏨 Seeding hotels...");
    const hotels = await Hotel.insertMany(hotelsData);
    console.log(`✅ Created ${hotels.length} hotels`);

    // Seed Locations
    console.log("📍 Seeding locations...");
    const locations = await Location.insertMany(locationsData);
    console.log(`✅ Created ${locations.length} locations`);

    // Seed Food Options
    console.log("🍽️  Seeding food options...");
    const foodOptions = await FoodOption.insertMany(foodOptionsData);
    console.log(`✅ Created ${foodOptions.length} food options`);

    // Seed Packages
    console.log("📦 Seeding packages...");
    const packagesTemplate = generatePackagesData();
    const packagesData = packagesTemplate.map((pkg) => {
      // Get hotels matching the package country
      const matchingHotels = hotels.filter(h => h.country === pkg.country).slice(0, 3);
      const matchingLocations = locations.filter(l => l.country === pkg.country).slice(0, 5);
      const matchingFoodOptions = foodOptions.slice(0, 5);

      return {
        ...pkg,
        itinerary: matchingLocations.map(l => l._id),
        availableHotels: matchingHotels.map(h => h._id),
        availableFoodOptions: matchingFoodOptions.map(f => f._id),
      };
    });
    const packages = await Package.insertMany(packagesData);
    console.log(`✅ Created ${packages.length} packages`);

    // Seed Bookings
    console.log("📋 Seeding bookings...");
    const bookingsData = [];
    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPackage = packages[Math.floor(Math.random() * packages.length)];
      const statuses = ["Pending", "Confirmed", "Cancelled"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const baseAmount = randomPackage.basePrice;
      const amount = baseAmount + Math.floor(Math.random() * 10000);

      bookingsData.push({
        packageId: randomPackage._id,
        user: randomUser._id,
        amount: amount,
        paymentId: `pay_${Math.random().toString(36).substring(7)}`,
        orderId: `order_${Math.random().toString(36).substring(7)}`,
        status: randomStatus,
      });
    }
    const bookings = await Booking.insertMany(bookingsData);
    console.log(`✅ Created ${bookings.length} bookings`);

    // Seed Reviews
    console.log("⭐ Seeding reviews...");
    const reviewsData = [];
    const reviewTitles = [
      "Amazing Experience!",
      "Great Value for Money",
      "Wonderful Trip",
      "Highly Recommended",
      "Perfect Getaway",
      "Memorable Journey",
      "Exceeded Expectations",
      "Beautiful Destinations",
      "Excellent Service",
      "Fantastic Package",
      "Unforgettable Memories",
      "Top Notch Experience",
      "Best Vacation Ever",
      "Incredible Journey",
      "Outstanding Service",
    ];
    const reviewComments = [
      "Had an amazing time! Everything was well organized.",
      "Great value for money. Would definitely recommend.",
      "Wonderful experience from start to finish.",
      "Highly recommend this package to everyone.",
      "Perfect getaway from the daily routine.",
      "Created so many memorable moments.",
      "Service exceeded all our expectations.",
      "Beautiful destinations and great accommodations.",
      "Excellent customer service throughout the trip.",
      "Fantastic package with great inclusions.",
      "Unforgettable memories that will last forever.",
      "Top notch experience with professional service.",
      "Best vacation we've ever had!",
      "Incredible journey with amazing sights.",
      "Outstanding service and attention to detail.",
    ];

    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPackage = packages[Math.floor(Math.random() * packages.length)];
      const randomBooking = bookings[Math.floor(Math.random() * bookings.length)];
      const rating = Math.floor(Math.random() * 5) + 1; // 1-5
      const titleIndex = Math.floor(Math.random() * reviewTitles.length);
      const commentIndex = Math.floor(Math.random() * reviewComments.length);

      reviewsData.push({
        package: randomPackage._id,
        user: randomUser._id,
        booking: randomBooking._id,
        rating: rating,
        title: reviewTitles[titleIndex],
        review: reviewComments[commentIndex],
        comment: reviewComments[commentIndex],
        images: [
          "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
        ],
        helpfulVotes: Math.floor(Math.random() * 50),
        votedBy: [],
      });
    }
    const reviews = await PackageReviews.insertMany(reviewsData);
    console.log(`✅ Created ${reviews.length} reviews`);

    // Seed Gallery Images
    console.log("🖼️  Seeding gallery images...");
    const galleryData = [];
    const captions = [
      "Beautiful sunset at the beach",
      "Amazing architecture",
      "Local culture and traditions",
      "Stunning landscapes",
      "Delicious local cuisine",
      "Historic monuments",
      "Vibrant markets",
      "Peaceful moments",
      "Adventure activities",
      "Cultural performances",
      "Scenic views",
      "Wildlife encounters",
      "Traditional crafts",
      "Festive celebrations",
      "Natural wonders",
    ];
    const locationsList = [
      "Mumbai, India",
      "Dubai, UAE",
      "Goa, India",
      "Jaipur, India",
      "New Delhi, India",
      "Jaisalmer, India",
      "Shimla, India",
      "Bangalore, India",
    ];

    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const captionIndex = Math.floor(Math.random() * captions.length);
      const locationIndex = Math.floor(Math.random() * locationsList.length);

      galleryData.push({
        userId: randomUser._id,
        imageUrl: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
        caption: captions[captionIndex],
        location: locationsList[locationIndex],
        tags: ["travel", "vacation", "adventure", "culture"],
      });
    }
    const galleryImages = await GalleryImage.insertMany(galleryData);
    console.log(`✅ Created ${galleryImages.length} gallery images`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Hotels: ${hotels.length}`);
    console.log(`   - Locations: ${locations.length}`);
    console.log(`   - Food Options: ${foodOptions.length}`);
    console.log(`   - Packages: ${packages.length}`);
    console.log(`   - Bookings: ${bookings.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - Gallery Images: ${galleryImages.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

