import mongoose from "mongoose";

// Schema must match MUSAFIR-Exommerce backend gallery.model.js (shared main DB)
const GalleryImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: String,
  caption: String,
  location: String,
  tags: [String],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const GalleryImage = mongoose.model("GalleryImage", GalleryImageSchema);
export default GalleryImage;
