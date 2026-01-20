import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A location must have a name (e.g., Gateway of India)."],
  },
  country: {
    type: String,
    required: [true, "A location must specify its country."],
    trim: true,
  },
  city: String,
  details: {
    type: String,
    required: true,
  },
  locationImage: String,
  day: {
    type: Number,
    required: [true, "A location must be assigned a day in the itinerary."],
  },
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
