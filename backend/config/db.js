import mongoose from "mongoose";

// Use MONGODB_URI (Musafir main DB) or fallback to MONGO_URL
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;

export const connectDB = async () => {
  try {
    if (!mongoUri) {
      throw new Error("Missing MongoDB URI: set MONGODB_URI or MONGO_URL in .env");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully (main DB)");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
export default connectDB;
