import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A package must have a name."],
    unique: true,
    trim: true,
  },
  slug: String,
  description: String,
  basePrice: {
    type: Number,
    required: [true, "A package must have a base starting price."],
  },
  durationDays: {
    type: Number,
    required: [true, "A package must have a duration in days."],
  },
  isRecommended: {
    type: Boolean,
    default: false,
  },
  bestSeason: {
    type: String,
    enum: ["winter", "summer", "monsoon", "all"],
    default: "all",
  },
  images: {
    type: String,
    default: "https://res.cloudinary.com/dpu6rveug/image/upload/v1759671196/Screenshot_2025-10-05_190108_mxt8nl.png",
  },
  country: {
    type: String,
    required: [true, "A package must have a country."],
  },
  // Relationships: References to other schemas
  itinerary: [
    {
      // References the places the user will visit
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
  ],
  availableHotels: [
    {
      // References the hotels the user can choose from
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
  ],
  availableFoodOptions: [
    {
      // References the food plans the user can choose from
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodOption",
    },
  ],
});

// Middleware to auto-create the slug before saving
packageSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

const Package = mongoose.model("Package", packageSchema);
export default Package;
