import mongoose from "mongoose";

const foodoptionType = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    default: "Breakfast",
    required: true,
  },
  surcharge: {
    // Extra cost relative to the hotel's base room price
    type: Number,
    default: 0,
  },
});

const foodOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A food option must have a name (e.g., Full Board)."],
    unique: true,
  },
  surchargePerDay: {
    type: Number,
    required: [true, "A food option must have a daily surcharge amount."],
    default: 0,
  },
  foodOptions: {
    type: [foodoptionType],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
    default: "",
  },
});

const FoodOption = mongoose.model("FoodOption", foodOptionSchema);
export default FoodOption;
