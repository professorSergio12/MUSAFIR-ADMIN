import { HotelSchema } from "../validations/hotelValidation.js";
import Hotel from "../models/hotel.model.js";
import { errorHandler } from "../util/error.js";
import { getDataURI } from "../middleware/parser.js";
import cloudinary from "../config/cloudinary.js";
export const createHotel = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(errorHandler(400, "At least one image is required"));
    }

    const { name, country, city, pricePerNight, tier, roomTypes, description } =
      req.body;

    // 🔹 Upload images to Cloudinary
    const imageUrls = [];

    for (const file of req.files) {
      const fileUri = getDataURI(file);
      const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
        folder: "gallery",
      });
      imageUrls.push(uploadRes.secure_url);
    }

    // 🔹 Prepare clean data object
    const hotelData = {
      name,
      country,
      city,
      description,
      tier,
      pricePerNight: Number(pricePerNight),
      images: imageUrls,
      roomTypes: JSON.parse(roomTypes),
    };

    // 🔹 Zod validation
    const { error } = HotelSchema.safeParse(hotelData);
    if (error) {
      const err = JSON.parse(error.message);
      return next(errorHandler(400, err[0].message));
    }

    // 🔹 Save to DB
    const newHotel = new Hotel(hotelData);
    await newHotel.save();

    res.status(201).json({
      status: "success",
      message: "Hotel created successfully",
    });
  } catch (error) {
    console.error("Create hotel error:", error);
    next(error);
  }
};

export const getAllHotel = async (req, res, next) => {
  const limit = 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  try {
    const [allHotel, totalHotels] = await Promise.all([
      Hotel.find(
        {},
        {
          name: 1,
          city: 1,
          country: 1,
          pricePerNight: 1,
          tier: 1,
        }
      )
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }),
      Hotel.countDocuments(),
    ]);
    res
      .status(200)
      .json({ status: "success", data: allHotel, totalHotels: totalHotels });
  } catch (error) {
    console.log("Error in get all Hotels", error);
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const hotelData = await Hotel.findById(req.params.id);
    res.status(200).json({ status: "success", data: hotelData });
  } catch (error) {
    console.log("Error in get hotel by id", error);
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name, country, city, pricePerNight, tier, description } = req.body;

    const parsedRoomTypes = req.body.roomTypes
      ? JSON.parse(req.body.roomTypes)
      : [];

    const parsedImages = req.body.images ? JSON.parse(req.body.images) : [];

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return next(errorHandler(404, "Hotel not found"));
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const fileUri = getDataURI(file);
      const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
        folder: "gallery",
      });
      uploadedImages.push(uploadRes.secure_url);
    }

    const oldImages = hotel.images || [];
    const removedImages = oldImages.filter(
      (img) => !parsedImages.includes(img)
    );

    for (const imageUrl of removedImages) {
      try {
        const publicId = imageUrl
          .split("/upload/")[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }
    }

    const finalImages = [...parsedImages, ...uploadedImages];

    const updateData = {
      name,
      country,
      city,
      tier,
      description,
      pricePerNight: Number(pricePerNight),
      roomTypes: parsedRoomTypes,
      images: finalImages,
    };

    const updatedHotel = await Hotel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: updatedHotel,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!deletedHotel) {
      return next(errorHandler(404, "Error in deleting Hotel..."));
    }

    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

export const searchHotelByquery = async (req, res, next) => {
  console.log(req.query);
  const limit = 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  try {
    const query = req.query.hotel || req.query.cntry || req.query.tier;

    const filter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
        { tier: { $regex: query, $options: "i" } },
      ],
    };

    const [data, total] = await Promise.all([
      Hotel.find(filter, {
        name: 1,
        city: 1,
        country: 1,
        pricePerNight: 1,
        tier: 1,
      })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }),

      Hotel.countDocuments(filter),
    ]);
    res.status(200).json({ status: "success", data: data, totalHotels: total });
  } catch (error) {
    console.log("Error in search hotel by query", error);
    next(error);
  }
};

// Lightweight endpoint for searchable dropdown pickers
// GET /api/admin/hotel/picker?q=...&limit=...
export const getHotelPicker = async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.min(Number(req.query.limit || 50), 200);

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { city: { $regex: q, $options: "i" } },
            { tier: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const data = await Hotel.find(filter, {
      _id: 1,
      name: 1,
      tier: 1,
      pricePerNight: 1,
      city: 1,
      country: 1,
    })
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.log("Error in hotel picker", error);
    next(error);
  }
};

export const exportData = () => {
  const { exportType, search, tier, page = 1, limit = 10 } = req.query;
  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
    ];
  }
  if (tier) {
    query.tier = tier;
  }
};

const exportALLHotel = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error in export hotel data", error);
    next(error);
  }
};
