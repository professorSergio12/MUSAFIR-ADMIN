import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surcharge: {
      // Extra cost relative to the hotel's base room price
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A hotel must have a name."],
    unique: true,
  },
  country: {
    type: String,
    required: [true, "A hotel must specify its country."],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "A hotel must have a city/location."],
  },
  tier: {
    type: String,
    enum: ["Budget", "Standard", "Luxury"],
    default: "Standard",
  },
  pricePerNight: {
    type: Number,
    required: [true, "A hotel must have a base price per night."],
  },
  images: {
    type: [String],
    default: [],
  },
  roomTypes: [roomTypeSchema],
  description: String,
});

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
