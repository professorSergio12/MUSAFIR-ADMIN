import GalleryImage from "../models/gallery.model.js";
import { errorHandler } from "../util/error.js";
import { getDataURI } from "../middleware/parser.js";
import cloudinary from "../config/cloudinary.js";

// Get all gallery images
export const getAllGalleryImages = async (req, res, next) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.status(200).json({
      status: "success",
      data: images,
    });
  } catch (error) {
    console.error("Get gallery images error:", error);
    next(error);
  }
};

// Upload gallery image
export const uploadGalleryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "Image is required"));
    }

    const { caption, location, tags } = req.body;

    // Upload to Cloudinary
    const fileUri = getDataURI(req.file);
    const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
      folder: "gallery",
    });

    // Parse tags if provided
    const parsedTags = tags ? JSON.parse(tags) : [];

    // Save to database
    const newImage = new GalleryImage({
      userId: req.user?.id || null,
      imageUrl: uploadRes.secure_url,
      caption: caption || "",
      location: location || "",
      tags: parsedTags,
    });

    await newImage.save();

    res.status(201).json({
      status: "success",
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    console.error("Upload gallery image error:", error);
    next(error);
  }
};

// Update gallery image
export const updateGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { caption, location, tags } = req.body;

    const image = await GalleryImage.findById(id);
    if (!image) {
      return next(errorHandler(404, "Image not found"));
    }

    let imageUrl = image.imageUrl;

    // If new file is uploaded, replace the old one
    if (req.file) {
      // Delete old image from Cloudinary
      try {
        const oldPublicId = image.imageUrl
          .split("/upload/")[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }

      // Upload new image
      const fileUri = getDataURI(req.file);
      const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
        folder: "gallery",
      });
      imageUrl = uploadRes.secure_url;
    }

    // Parse tags if provided
    const parsedTags = tags ? JSON.parse(tags) : image.tags;

    // Update image
    image.imageUrl = imageUrl;
    if (caption !== undefined) image.caption = caption;
    if (location !== undefined) image.location = location;
    image.tags = parsedTags;

    await image.save();

    res.status(200).json({
      status: "success",
      message: "Image updated successfully",
      data: image,
    });
  } catch (error) {
    console.error("Update gallery image error:", error);
    next(error);
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await GalleryImage.findById(id);
    if (!image) {
      return next(errorHandler(404, "Image not found"));
    }

    // Delete from Cloudinary
    try {
      const publicId = image.imageUrl
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, "");
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Cloudinary delete failed:", err);
    }

    // Delete from database
    await GalleryImage.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    next(error);
  }
};
